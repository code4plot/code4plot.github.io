---
layout: post
title: "Dynamically accessing data from IBM DB2 with Shinyapps"
date: "2020-08-14 17:22:40 +0800"
categories: real_estate sql shiny
---

My current shinyapps are deployed together with the table from which it refers to.  This means that, for every update to the table (which was manually performed), I will need to redeploy the app.  

One solution around it was to:  

1. [Get the table up on an SQL database (in this case, IBM DB2)]({% post_url 2020-07-24-migrating-ura-rental-data-to-ibm-cloud %})  
  a. This table will be updated every quarter, scheduled.  

2. Write a shinyapp that dynamically access data from this remote database  

I achieved this step by first loading ibmdbR library into the environment, which uses RODBC to access the remote database.  

```
library(ibmdbR)
#load credentials
#you should find these out from the remote database
dsn_driver <- "BLUDB"
dsn_database <- "BLUDB"
dsn_hostname <- "hostname"
dsn_port <- "50000"
dsn_protocol <- "TCPIP"
dsn_uid <- "userID"
dsn_pwd <- "password"
conn_path <- paste(dsn_driver,
                ";DATABASE=", dsn_database,
                ";HOSTNAME=", dsn_hostname,
                ";PORT=", dsn_port,
                ";PROTOCOL=",dsn_protocol,
                ";UID=", dsn_uid,
                ";PWD=", dsn_pwd)
#connect
ch <- idaConnect(conn_path)
#initiate connection
idaInit(ch)

#select * from table
fetchTable <- ida.data.frame("TABLE")

#select COL1,COL2 from table
fetchTable <- ida.data.frame("TABLE")[,c("COL1","COL2")]

#select * from table where COL1 = "COND1"
fetchTable <- ida.data.frame("TABLE")
subTable <- fetchTable[fetchTable$COL1 == "COND1",]
```
`ibmdbR` fetches your remote table as an `ida.data.frame` object, which is limited to SQL commands (with some operator limitations; read the documentation). But R commands like `head()` and `as.data.frame()` works on this class object.

To load the table into the environment as a `data.frame`, simply type  
```
thisTable <- as.data.frame(fetchTable)
```

Which will download the remote table into the variable "thisTable".  

However, in order for shinyapps to dynamically access your remote database, you need to establish connection within the reactive elements of shiny  

```
#conn_path as above, and can be outside the reactive elements
server <- shinyServer(function(input, output, session) {
  output$plot <- renderPlotly({
    ch <- idaConnect(conn_path)
    idaInit(ch)
    #load table
    fetchTable <- ida.data.frame("TABLE")
    ...
    #get final table for plotting
    df <- as.data.table(fetchTable[fetchTable$COL1 == "COND1",c("COL1","COL2",...)])
    #each column are assigned as 'character' type
    #assign the correct type to each column
    s <- ggplot(df,...)
    s
    })
})
```

At this point, this shinyapp can be run locally, but I could not deploy it to shinyapps.io, as it appears that shinyapps.io does not support `BLUDB` driver, or proprietary drivers (read here; however the post is old).  If you know a solution, please let me know!  

An alternative approach is to pack everything into a docker, and deploy it on kubernetes - I don't know how to do any of these yet, but that means opportunity to learn!  
