---
layout: post
title: "Building an Automated KTMB Ticket Checker with Telegram Remote Control"
subtitle: "A two-service GCP architecture for monitoring cross-border train availability"
date: "2026-05-25"
tags: automation gcp playwright telegram python cloud-run
---

## The Problem

If you've ever tried to book a KTMB shuttle train between **JB Sentral** and **Woodlands CIQ**, you know the drill: tickets open up unpredictably, sell out fast, and the only way to catch availability is to keep refreshing the booking page at the right moment.

Doing that manually is tedious and unreliable. The goal here was simple—automate the checking, and get notified the moment seats open up.

---

## Architecture Overview

The solution is split into two independent microservices, both hosted on GCP:

| Service | Repo | Role |
|---|---|---|
| `ktmb-checker` | GCP Cloud Run | Runs the availability check on a schedule |
| `ktmb-tg-control` | GCP Cloud Run | Telegram bot for remote control |

Both services share a common **storage layer** (GCP Cloud Storage) as their communication backbone. The checker writes its state and results; the bot reads configuration and runtime status from the same store.

```
[Cloud Scheduler] ──▶ [ktmb-checker / Cloud Run]
                              │
                         [GCP Storage]
                              │
                       [ktmb-tg-control / Cloud Run]
                              │
                        [Telegram Bot API]
                              │
                          [You]
```

This decoupled design means each service can be deployed, restarted, or scaled independently without breaking the other.

---

## The Checker: Browser Automation with Playwright

KTMB's shuttle booking page doesn't expose a public API, so the checker uses **Playwright** to drive a real Chromium browser—clicking buttons, filling in dates, and reading the results table exactly like a human would.

### The Booking Flow

1. Navigate to the KTMB ShuttleTrip booking page
2. Detect current route direction; swap stations if needed
3. Interact with the calendar widget to select the target travel date
4. Submit the search form and wait for results
5. Parse the results table for trains in the preferred time window

```python
# Simplified flow inside ktmb_checker.py
browser = playwright.chromium.launch()
page = browser.new_page()
page.goto(KTMB_SHUTTLE_URL)

# Handle station swap if route is reversed
if current_origin != config.origin:
    page.click("[data-swap-btn]")

# Navigate the calendar to the target date
select_date(page, config.travel_date)

page.click("[data-search-btn]")
page.wait_for_selector(".results-table")

trains = parse_availability(page, config.time_from, config.time_to)
```

### Deduplication: Avoiding Repeat Alerts

One tricky part is avoiding a flood of duplicate notifications. Each check compares the current set of available trains against what was found last time, using a **hash of the availability result** stored in GCP Storage.

Only when the hash changes—meaning new seats appeared—does a Telegram alert fire. This keeps the notifications signal-heavy and noise-free.

### Locking

Because the checker can be triggered both by Cloud Scheduler and by a manual `/checknow` from the Telegram bot, a **lock mechanism** prevents two runs from colliding. The lock is written to storage at the start of a run and cleared on exit.

---

## The Telegram Bot: A Remote Control in Your Pocket

The `ktmb-tg-control` service runs a **python-telegram-bot** instance that lets you manage the checker entirely through chat commands. No SSH, no GCP console—just Telegram.

### Available Commands

| Command | What it does |
|---|---|
| `/status` | Shows config + runtime stats + last found trains |
| `/showconfig` | Dumps the full config dict |
| `/on` / `/off` | Enables or disables the checker; resumes/pauses Cloud Scheduler |
| `/checknow` | Triggers an immediate out-of-schedule check |
| `/setdate YYYY-MM-DD` | Sets the travel date |
| `/settime HHMM HHMM` | Sets the preferred departure window |
| `/setroute ORIGIN DEST` | Sets the route (JB SENTRAL ↔ WOODLANDS CIQ) |

### The Scheduler Integration

`/on` and `/off` don't just flip a flag—they also **pause or resume the Cloud Scheduler job** that periodically triggers the checker. This means turning off the bot actually stops unnecessary Cloud Run invocations rather than just making the checker skip silently.

```python
# scheduler.py (inside ktmb-tg-control)
def resume_scheduler_job():
    service = build("cloudscheduler", "v1")
    service.projects().locations().jobs().resume(
        name=_job_name()
    ).execute()

def pause_scheduler_job():
    service = build("cloudscheduler", "v1")
    service.projects().locations().jobs().pause(
        name=_job_name()
    ).execute()
```

### Authorization

All commands verify the incoming chat ID against a configured `TELEGRAM_CHAT_ID`. Any message from an unknown chat is silently ignored—so even if someone finds the bot token, they can't control it.

---

## The Storage Layer as Shared State

Rather than running a database, both services communicate through **structured JSON files in GCP Cloud Storage**:

- `config.json` — travel date, time range, route, enabled flag
- `runtime.json` — last check timestamp, last result hash, last found trains, error log

The bot reads and writes config; the checker reads config and writes runtime. This is a lightweight but effective pattern for two services that don't need to talk in real time.

---

## Deployment

Both services are containerized with Docker and deployed on **Cloud Run**—serverless, so there's no always-on cost. The checker is invoked on a cron schedule via **Cloud Scheduler**, and only runs for a few seconds each time (Playwright spins up fast with Chromium bundled in the container).

```dockerfile
FROM python:3.11-slim
RUN pip install playwright && playwright install chromium --with-deps
COPY . /app
CMD ["python", "app.py"]
```

---

## Challenges Along the Way

**Calendar navigation**: The KTMB booking calendar requires clicking through month/year controls rather than typing a date directly. This meant implementing logic to calculate how many "next" clicks are needed relative to the current month—something that breaks subtly if the page loads slowly.

**Seat availability parsing**: The results table marks unavailable trains with a CSS `disabled` class, but it's not consistent across all cases. The parser had to handle both zero-seat counts and disabled button states as separate unavailability signals.

**Keeping state across two services**: Early versions passed configuration via environment variables, which meant redeploying the checker every time travel details changed. Switching to shared GCP Storage made the bot genuinely useful—you can update dates and times on the fly without touching Cloud Run.

---

## What It Looks Like in Practice

A typical session:

1. Open Telegram, send `/on` — the bot enables the checker and resumes the schedule
2. Send `/setdate 2026-06-01` and `/settime 0600 0900` — set your target
3. Go about your day
4. Get a Telegram message: *"Availability found: 07:15 JB Sentral → Woodlands CIQ — 12 seats"*
5. Book immediately, then send `/off`

The whole loop is remote and asynchronous. The checker does the tedious refreshing; you only intervene when it matters.

---

## Takeaway

The two-service split turned out to be the right call. The checker stays focused on one job—browser automation and alerting—while the bot handles all the operational surface area. Shared storage as the communication layer is simple enough to debug and inspect directly, which mattered during development.

For a personal automation project, this setup is minimal but genuinely useful. The main limitation is that it's hardcoded to a single route and a single user—scaling it to multiple users or routes would require rethinking the storage model significantly. For now, though, it solves the problem it was built for.
