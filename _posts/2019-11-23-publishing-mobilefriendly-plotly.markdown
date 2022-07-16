---
layout: post
title: "Publishing mobile-friendly plotly (with miniUI and shinyapps)"
date: "2019-11-23 17:47:54 +0800"
categories: real_estate shiny
author: "Jason Lai"
---

A friend of mine was browsing the rental stats of condominium on his mobile phone, and it became immediately obvious that the deployed shinyapps containing the plot does not render well on mobile screens.  

Fortunately, none of the mobile apps he showed me display graphs, which is a better way to visualize data and synthesize them.  

Thus, I searched for solutions and found [miniUI](https://github.com/rstudio/miniUI).  miniUI functions to scale your plot (deployed with shinyapps) to mobile screens.  

To give miniUI a test drive, I've put together a [previous plot](https://jazzdaman8.wixsite.com/plot/rental-district) that visualizes the distribution of condominium rent of each district in Singapore with a violin plot.  Users can choose to show the national median and quantiles (to compare with).  

Here's how the plot renders on my desktop:  

{% include image.html url="/assets/img/rental3_191123.png" description="" %}  

And on my mobile phone:  

{% include image.html url="/assets/img/rental4_191123.jpg" description="" %}  

Plenty of room for improvements, but it's better.  

You can access the mobile version of this plot [here](https://plotproject.shinyapps.io/condo_mobile/)  
