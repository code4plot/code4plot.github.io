---
layout: post
title:  "Visualizing Rental Prices in Singapore"
date:   2019-10-28 16:09:12 +0800
categories: real-estate shiny
author: Jason Lai
---
{% include image.html url="/assets/img/rental_191028.png" description="Rental (psf) statistics of 'The Hillford' condominium in Singapore.  Individual points represents a tenancy contract signed on the given quarter.  Solid lines represent the median (black) and quartiles (grey) respectively." %}

The Urban Redevelopment Authority (URA) of Singapore compiles a comprehensive data of private residences relating to sale and rental prices.  I usually consult the data here to understand the market price.  Here is one example plotting the rental price (S$) per square feet against the median and quartiles within the same district zone.  Clearly, the rental rate of "The Hillford" on a per square feet basis is a premium in the neighborhood (likely due to its floor size; Hillford_median = 350 sqft, district_median = 1250 sqft), but can be among the lowest in absolute rent/month (see below).

{% include image.html url="/assets/img/rental2_191028.png" description="Rental (per month) statistics of 'The Hillford' condominium in Singapore.  Individual points represents a tenancy contract signed on the given quarter.  Solid lines represent the median (black) and quartiles (grey) respectively." %}

For an interactive plot of these data (i.e. with filters), please visit this [page](https://plotproject.shinyapps.io/rentalplot/).

Data source: [URA](https://www.ura.gov.sg/maps/api/#private-residential-properties-rental-contract)  
Input data: [csv file](https://github.com/code4plot/plot/blob/master/real_estate/rawDat_191028.csv)  
Rscript: <script src="https://gist.github.com/code4plot/ddb4bf445463fdc5c0c56c1f6a4bc11e.js"></script>
