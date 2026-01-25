---
layout: post
title: "Singapore Rental Price Trends Dashboard"
---

# Singapore Rental Price Trends Dashboard

## Problem
Publicly available rental data in Singapore is published primarily in **tabular form**, which makes it difficult to detect pricing trends, compare developments, or understand market dynamics over time. Static tables obscure temporal patterns that are critical for rental decision-making.

## Data Source
- **URA API Service**
- Public residential rental transaction data
- Time-series rental prices across private residential properties in Singapore

📘 URA API Documentation:  
https://eservice.ura.gov.sg/maps/api/#introduction

## Approach

### Data Extraction
- Programmatically retrieved rental transaction data from the URA API
- Built a reproducible pipeline to support ongoing data refreshes

### Data Wrangling
- Cleaned and reshaped raw tables using *tidyr* approach
- Normalized rental prices and floor area to support multiple price representations
- Structured data for flexible time-series aggregation

### Visualization & Dashboarding
- Developed an interactive dashboard using **R Shiny**
- Implemented user-controlled filters to support targeted analysis:
  - **Condo project selection** (project-level drill-down)
  - **Custom time period selection**
  - **Rental price representation**:
    - Absolute rental price (SGD)
    - Price per square foot (PSF)
  - **Temporal granularity**:
    - Monthly trends
    - Quarterly trends
- Designed visualizations to emphasize trend clarity, normalization, and comparability

## Outcome
- Delivered a **live interactive dashboard** that enables users to:
  - Compare rental price trajectories across individual condo projects
  - Normalize prices using PSF for fairer cross-property comparison
  - Adjust time aggregation to balance signal vs volatility
- Converted raw public housing data into a practical **decision-support product**

🔗 **Live Application**:  
https://plotproject.shinyapps.io/singapore_rental/

## Key Takeaways
- Interactive filtering materially improves interpretability of rental market data
- Price normalization (absolute vs PSF) significantly changes trend interpretation
- Temporal aggregation choices (monthly vs quarterly) affect signal stability
- Well-designed dashboards bridge the gap between raw data and real-world decisions

## Tools & Stack
- R
- URA API
- Tidyverse
- Shiny

## Repository
👉 https://github.com/YOUR_USERNAME/singapore-rental-price-trends
