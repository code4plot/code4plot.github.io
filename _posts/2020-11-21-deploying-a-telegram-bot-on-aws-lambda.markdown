---
layout: post
title: "Deploying a telegram bot on AWS Lambda"
date: "2020-11-21 13:32:29 +0800"
categories: aws bot
author: "Jason Lai"
---
__Introduction - a need for a bot__
I am part of a local homebrew group in Singapore - a collection of homebrewers who brew/ferment almost anything you can think of - conventional/craft beers, mead, wine, etc.  I myself ferment [glutinous rice foochow style](http://www.recipies.50webs.com/foochow%20red%20wine.htm), cendol beer, and sourdough (if you consider the starter culture as a process of fermentation).  

We rely on WhatsApp and Facebook for communications, and for a time now, there's a desire to make use of bots to help handle some FAQs, group buys and the likes.  So, I decided to take up the challenge and get my hands dirty.  

__What you need__
1. Telegram  
2. [python-telegram-bot](https://github.com/python-telegram-bot)  
3. AWS account (sign up for rfree tier [here](https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc))  
  a. AWS Lambda
  b. AWS API Gateway

### Register a bot with `@BotFather`
{% include image.html url="/assets/img/botfather_201121.jpg" description="" %}  

In your telegram, search for `@BotFather` if you have not already done so.  
In the chat box, type `/newbot`  
Then, follow a few simple steps, as shown below:  
{% include image.html url="/assets/img/botfather2_201121.jpg" description="" %}  
You have registered a bot with telegram.  Next is to program it to respond to commands or text, and then deploy it on AWS Lambda.  

### Python library for telegram bot
I am using [python-telegram-bot](https://github.com/python-telegram-bot) to program my telegram bot.  
We will be deploying this package in a Lambda layer to supplement the Lambda function.  
In your python interpreter, type the following command:  
```
pip install --target ./python python-telegram-bot
```
Go to the current working directory, and you should find "python" folder.  Compress this folder.  What we are trying to achieve is a zip directory tree that looks like this  

```
+-- python-telegram-bot.zip
|   +--python/.github
|   +--python/telegram
```
... and so on  

### Setup AWS Lambda
Open up your AWS console and head straight to AWS Lambda.  Click on "Create Function" on the top right hand corner of the page.  You will be directed to a new page.  Fill in the following information:  

- Select "Author from scratch"  
- Function name: <function-name> (eg. plotprojectdemo_bot)  
- Runtime: Python 3.8  
- Execution role: Create a new role with Lambda permissions  

It should look something like this:  
{% include image.html url="/assets/img/awslambda_201121.jpg" description="" %}  

Click "Create function" at the bottom right.  
You will be redirected to a new page to configure your new Lambda Function.  

### Deploying python-telegram-bot layer
On the left panel, look for Additional resources > Layers.  Then in the top right, click 'Create layer'.  
Configure your new layer as so:  

- Name: python-telegram-bot  
- Select Upload a .zip file  
- Proceed to upload the 'python-telegram-bot.zip' file you created earlier  
- Compatible runtimes: python 3.6, python 3.7, python 3.8  

The configuration should look like so:  
{% include image.html url="/assets/img/awslambda2_201121.jpg" description="" %}  

Click "Create".  

### Setup API for your telegram bot webhook
We will now setup an API to your AWS Lambda function for your newly bot to communicate with.  
In your AWS Console, search for AWS API Gateway.  Click "Create API" at the top right hand corner.  
Scroll down to find "REST API" (not REST API Private).  Click "Build".  Use the following settings:  

- API name: <any name> (eg. plotproject_bot)  
- Description: optional, but good for your reference  
{% include image.html url="/assets/img/awslambda3_201121.jpg" description="" %}  

Click "Create".  You will be directed to a new page.  
Here, you want to create a new method like so:  
{% include image.html url="/assets/img/awslambda4_201121.jpg" description="" %}  

Click on the tick to confirm.  Setup this new method:  

- Integration type: Lambda function  
- Use Lambda Proxy Integration: check  
- Lambda Region: <your region> (eg ap-southeast-1)  
- Lambda function: <lambda function name> (eg plotprojectdemo_bot)  
- Use Default Timeout: check  

The settings would look like this:  
{% include image.html url="/assets/img/awslambda5_201121.jpg" description="" %}  

Click "Save"  
Now you can click "Test", select method "POST", scroll down and click "Test" again.  You will get an output to the right, which prints  
```
Sat Nov 21 06:18:58 UTC 2020 : Method response body after transformations: "Hello from Lambda!"
Sat Nov 21 06:18:58 UTC 2020 : Method response headers: {X-Amzn-Trace-Id=Root=1-5fb8b151-2be59f1a881ad1d7285c99f8;Sampled=0}
Sat Nov 21 06:18:58 UTC 2020 : Successfully completed execution
Sat Nov 21 06:18:58 UTC 2020 : Method completed with status: 200
```
`Method completed with status: 200` means it was successfully executed.  
We can now deploy the API.  Under Actions > Deploy API.  

- Deployment stage: [New Stage]  
- Stage name: <name> (eg demo, beta, V1, etc)  
- add some descriptions for your own reference  

Click "Deploy".  
{% include image.html url="/assets/img/awslambda6_201121.jpg" description="" %}  

At the top of the page, you will see a URL - this takes you to the API you deployed.  Click on it, and you'll get a response!  
Copy this URL.  

### Set telegram bot webhook
Have these ready:  

1. telegram bot TOKEN from BotFather  
2. AWS API URL  
In your browser, key in the following URL:  
```
https://api.telegram.org/bot<token>/setWebHook?url=<API URL>
```
You will receive the following prompt in your browser if setup is successful:  
```
{"ok":true,"result":true,"description":"Webhook was set"}
```
Whenever a chat is sent to the bot, telegram server will push this chat to AWS API, which will be directed to AWS Lambda "event" argument.  The Lambda function will then process this argument through python-telegram-bot.  

I'm quite new to webhooks, but this example alone really blew my mind on what one can do with web hooks.  

### Configure your AWS Lambda Function
Your AWS Lambda Function will program how your telegram bot will respond.  In this example, it will be a simple /start function, otherwise it will echo.  
Return to your AWS Lambda.  Under Layers, click "Add a layer".  Select "Custom layers", select "python-telegram-bot", and Version "1".  Click "Add"  
{% include image.html url="/assets/img/awslambda7_201121.jpg" description="" %}  

In the code editor, you will find a preloaded default code:  
```
import json

def lambda_handler(event, context):
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
```
We are going to replace it with the following python code.  

<script src="https://gist.github.com/jazzdaman/b589fe325e8b3264724ca787a0ae3f37.js"></script>  
Save the code, and then hit the "Deploy" button at the top right.  You're all set!  

### Have a chat with your bot
If everything is properly setup, go to your telegram and start chatting with your bot.  
`/start` will give you a reply "I'm a test bot. Neat!".  Other text will only get an echo.  
{% include image.html url="/assets/img/chatbot_201121.jpg" description="" %}  

Voila! You have deployed a telegram bot.  You can start configuring your bot to respond to more commands and texts.  You can program it to make full use of a whole range of AWS modules - translate, transcribe, machine learning, etc. The possibilities are endless.  

Enjoy!  

References:  
I received loads of tips from [here](https://dev.to/nqcm/-building-a-telegram-bot-with-aws-api-gateway-and-aws-lambda-27fg)  
[Telegram bots](https://core.telegram.org/bots)  
[python-telegram-bot](https://github.com/python-telegram-bot/python-telegram-bot)  
[serverless telegram bot](https://www.serverless.com/examples/aws-python-telegram-bot)  
