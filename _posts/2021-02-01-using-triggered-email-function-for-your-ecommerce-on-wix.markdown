---
layout: post
title: "Using Triggered Email function for your ecommerce on Wix"
date: "2021-02-01 14:03:23 +0800"
categories: ecommerce payments
author: "Jason Lai"
---

With the rise of ecommerce, Wix is among the top platforms for businesses small and large.  

I have been helping a friend to build an ecommerce website, and among the challenges we encounter is to make 'offline' payments (i.e. PayNow) experience as seamless as possible as credit card transactions.  

While one could easily customize the Thank You Page at check-out to include a PayNow QR code, it is not as intuitive to embed this QR code into the automated email that comes with Wix.  If a customer closes the tab by accident (thinking a copy of this QR code is sent to her/his email), then the payment is lost.  
{% include image.html url="/assets/img/paynow_210201.png" description="A sample PayNow QR code" %}  

However, with the [Triggered Email](https://support.wix.com/en/article/triggered-emails-getting-started) function in Wix, it is possible to send out the same QR code to your customers' email (immediately at the "thank you page").  

I will use a test example to illustrate the basic workflow involved, which can be built upon into more sophisticated triggered emails.  

First, create a triggered email template (Marketing & SEO > Dev Tools > Triggered Emails).  When you hit the "+ Create New" button on the top right, it'll load a pre-filled template.  We will use that for our test example.  Now click "Save & Publish", then in the popped up window, rename `Email ID` to `testEmail`.  The subsequent javascript code will reference to this string in order to pull out the email template you intend to send out.  
{% include image.html url="/assets/img/wixemail_210201.jpg" description="Change the Email ID to 'testEmail'" %}  

You will notice that a template code is also provided to you below.  We will skip that for the time being.  Now go ahead and edit your site.  At this point in time, you will want to enable developer mode (on the top left menu, Dev Mode > Turn on Dev Mode).  A bunch of panels will appear with a console below.  

On the left panel, you can navigate to a page of interest, where you want the email to be triggered (in this case, the "Thank You Page" under "Shop").  
{% include image.html url="/assets/img/wixemail2_210201.jpg" description="" %}  

In your console at the bottom, some codes will appear like so  

```
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

$w.onReady(function () {
 // Write your JavaScript here

 // To select an element by ID use: $w("#elementID")

 // Click "Preview" to run your code
});
```
What you want to do is input the actions to carry out after the page loads.  If for example, you add a `console.log("Hello, World!")`.  
```
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

$w.onReady(function () {
 // Write your JavaScript here
 console.log("Hello, World!");
 // To select an element by ID use: $w("#elementID")

 // Click "Preview" to run your code
});
```
Then click "Preview", you will find a "Hello, World!" output in your console log at the bottom  
{% include image.html url="/assets/img/wixemail3_210201.jpg" description="" %}  

Therefore, what we want to do is send out an email after the page loads.  
```
$w.onReady(function () {
 // Write your JavaScript here
 sendEmail(emailId, recipient); //emailId as per above; recipient will be email
 console.log("done");
});
```
Now, sendEmail is a function we need to write.  We will do this in the backend web module.  
{% include image.html url="/assets/img/wixemail4_210201.jpg" description="" %}  

Create a new file, say 'test-email.jsw'.  The console will show a bunch of codes.  You want to replace this block of code to our sendEmail function.  

```
export function multiply(factor1, factor2) {
 return factor1 * factor2;
}
```
to  
```
export function sendEmail(emailId, recipient){

 //wix send email function here

}    
```
Wix has two functions for sending email, one is under 'wixCrm' and another 'wixUsers'.  We will use wixCrmBackend.emailContact() for this example.  
```
import wixCrmBackend from 'wix-crm-backend';

export function sendEmail(emailId, recipient){
    //wix email function
    const toContact = recipientId;
    wixCrmBackend.emailContact(emailId, toContact, options);

}
```
`.emailContact()` takes three arguments:

1. `emailId` - the Email ID that identifies the triggered email template (here, "testEmail")  
2. `toContact` - takes in a string which identifies the user you are sending to.  In this ID, the backend server can identify the associated email to send to.  
3. (optional) some variables to pass to include in the email.  Read [here](https://support.wix.com/en/article/triggered-emails-using-variables-to-add-personalized-text)  

We have `emailId`, but `toContact` needs some setup.  
We will pass the email address into the `createContact()` function, which then returns a unique ID, which will be the input for `toContact` parameter.  

```
import wixCrmBackend from 'wix-crm-backend';

export function sendEmail(emailId, recipient){
 //emailId is an identifier for the triggered email template
 //recipient is an email address (a string)
 //create contact and get ID
    wixCrmBackend.createContact({
        emails:[recipient]
    })
    .then(contactId => {
 //send out email
 return wixCrmBackend.emailContact(emailId, contactId)
        .then(() => {
            console.log("email sent!");
        })
        .catch((err) => {
            console.log(err);
        });
    });
}
```
Before testing out if this script works (by hitting the preview button top-right), edit your Thank You Page console to include a test email address  
```
$w.onReady(function () {
 // Write your JavaScript here
 sendEmail('testEmail', 'username@somemail.com'); //emailId as per above; recipient will be email
 console.log("done");
});
```
Go ahead and hit the 'Preview' button.  If the console log says 'email sent!', you should receive this `testEmail` template in the specified email address.  

You now have the basic setup to trigger emails to be sent to your target customer/audience.  
