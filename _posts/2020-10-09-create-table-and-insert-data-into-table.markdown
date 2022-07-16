---
layout: post
title: "Create table and insert data into table"
date: "2020-10-09 17:43:26 +0800"
categories: real_estate sql
author: "Jason Lai"
---

In my previous post, I have [initiated]({%- post_url 2020-10-06-initiating-a-mysql-db-on-aws -%}) a MySQL DB instance on AWS. Time to upload some data, and I will begin with the URA rental data in Singapore.  

Previously, I would upload an entire table, most of which contain repetitive information:  
{% include image.html url="/assets/img/rental5_201009.png" description="" %}  
But, one could in fact split it into two tables, each holding distinctive set of information.  
(1) A table containing information about a property  
{% include image.html url="/assets/img/rental6_201009.png" description="" %}  
(2) A table related to (1) through 'CONDOID' that stores rental transaction info  
{% include image.html url="/assets/img/rental7_201009.png" description="" %}  

Actually, this is in fact the [original schema](https://www.ura.gov.sg/maps/api/#private-residential-properties-rental-contract) from the URA API.  

Using `pandas` and through `sqlalchemy` (`pd.to_sql`), I can now load them up into the DB.  

```
import MySQLdb
import pandas as pd
from sqlalchemy import create_engine

##engine to MySQL DB
#credentials to the specific DB
#user - username; pwd - password;
#host - host address; #schema - db name
engine = create_engine('mysql+mysqldb://%s:%s@%s:%s/%s'%(user,pwd,host,port,schema), echo = False)

##write pandas df to SQL DB
#tbl = table name on DB
#**kwargs - if_exists = [True,False], index = [True,False], chunksize = int
df.to_sql(tbl, engine, **kwargs)
```
That's it! Now I need to write a script to periodically update the table from the URA API.  

And with this RDBMS setup, I can now query the DB to produce the plots I need.
