---
layout: post
title: "Initiating a MySQL DB on AWS"
date: "2020-10-06 17:30:49 +0800"
categories: real_estate sql
author: "Jason Lai"
---

Working with IBM Cloud's [DB2]({% post_url 2020-07-24-migrating-ura-rental-data-to-ibm-cloud %}), although FOC, comes with its own challenges.  

1. I will need to reactivate my DB2 instance monthly, defeating the original purpose to automate my data capture process.  

2. The DB2 driver is not open source, and not supported by shinyapp.io, where I deploy my shiny apps.  

As plot. is a platform for me to use my skillsets, and also an experimental hobby, I try to keep my cost minimal; also appreciating the fact that cloud computing has come a long way, since my first deep dive into python programming in 2012-2014.  

Moreover, AWS is one of the more dominant cloud platforms in the industry, and one could create a free account and initiate a [MySQL DB instance quite easily](https://aws.amazon.com/rds/mysql/).  FOC period is limited, but one could attend some of their webinars and earn vouchers for future use (I attended their Builders Series and earned some vouchers in return for my survey participation).  

Few things to do:  

1. Migrate all URA rental data to AWS RDS  
2.  Make use of relational databases to store the data (1 table for property information; 1 table for rental information.  Potentially a third table for data scrapped from Property Guru website)  
