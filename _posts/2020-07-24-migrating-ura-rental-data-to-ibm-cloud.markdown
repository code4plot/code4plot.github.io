---
layout: post
title: "Migrating URA rental data to IBM Cloud"
date: "2020-07-24 17:19:12 +0800"
categories: real_estate sql
author: "Jason Lai"
---

Singapore entered into lock down mode (or 'Circuit Breaker') from March to June. I was not allowed to enter the lab to do experiments on the bench. So, I decided to take up online classes on EdX, specifically IBM Data Science course. It covered the topic on SQL, the basics, language; a general introduction.  

Within the entire IBM cloud platform, I am able to connect different "resources" with each other, such as connecting IBM Watson to IBM Cloud, where my SQL database sits. So, instead of manually updating my local database of URA's rental data, I decided to migrate everything there, and set a scheduler to run it every quarter (URA's data is updated monthly, but the query is in quarterly chunks).

The next thing I need to do now is to configure shiny to query directly from this SQL database.  
Let's see how it performs.  

jupyter notebook for my scheduled data capture  

<script src="https://gist.github.com/code4plot/9ff512b6e02de1689358a7d739e2d092.js"></script>
