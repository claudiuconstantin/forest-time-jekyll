---
layout: post
title:  "Postback and UpdatePanel in C#"
date:   2016-08-02 14:01:16 +0200
---

## The issue

Given button is working everywhere but in OS X Safari.

In the source the button has a seemingly regular href: `/builder/pages/preview3.aspx?InitPreview=true&pageid=<%= this.PageId %`.

However in the compiled code the button has this: `href="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions("_ctl0:menu:usrSaveAndViewBar:btnSaveAndPreviewIcon", "", true, "", "", false, true))"`.

## What is this postback?

Short answer from [here](http://www.c-sharpcorner.com/uploadfile/2f73dd/what-is-postback-in-Asp-Net/):

> PostBack is the name given to the process of submitting an ASP.NET page to the server for processing. PostBack is done if certain credentials of the page are to be checked against some sources (such as verification of username and password using database). This is something that a client machine is not able to accomplish and thus these details have to be 'posted back' to the server.

Ok this makes sense, we want to do some server-side processing on button click (this is a Save button).

## But how does a regular href become this postback call?

From the same source:

> If we create a web Page, which consists of one or more Web Controls that are configured to use AutoPostBack (Every Web controls will have their own AutoPostBack property), the ASP.Net adds a special JavaScipt function to the rendered HTML Page. This function is named _doPostBack() . When Called, it triggers a PostBack, sending data back to the web Server.

So now we know what it is and why it is there. Now, the next question is:

## Why does this postback not fire in Safari?
Thankfully, [I am not the one struggling with this](http://stackoverflow.com/questions/9995546/postback-not-firing-with-safari-5-1-5). This StackOverflow answer references another (by the way very well detailed) article [article by Eilon Lipton](http://weblogs.asp.net/leftslipper/sys-webforms-pagerequestmanagerparsererrorexception-what-it-is-and-how-to-avoid-it). "Add a PostBackTrigger to your UpdatePanel". What are those?

[UpdatePanel on MSDN](https://msdn.microsoft.com/en-us/library/bb399001.aspx):

> These controls (Script Manager and UpdatePanel) remove the requirement to refresh the whole page with each postback, which improves the user experience. 

Simple enough. The docs descibes that I can easily add a new one of theese by going to `View > Design view (or Toolbox) > Ajax extensions > UpdatePanel / Script manager`. We can see that adding such an Updatepanel will look something like this: `<asp:UpdatePanel ID="UpdatePanel1" runat="server"></asp:UpdatePanel>`, which is fine, but where is the one I am looking for (the one being repsonsible for my not working button)?

I can't see anything similar to an UpdatePanel. Is it possible we don't have one?
I check on other browser, the button DOES refreshes the site, so it's not asyncronous.

After some more Googling I find a [hopefully easy, fix by touching the Web.config](http://tracyswebdesign.blogspot.dk/2015/10/button-wont-postback-with-ios-9.html). I add the ' supportsCallback = true' line to our Safari support. Unfortunately no success.

## Dig deeper
Apparently I have to dig deeper. The button only stops working under certain circumstances: when we open up a post to edit. Let's see what does opening an article trigger.

After putting down breakpoints on various places and going through the code line by line, I felt like I needed help.

## The solution
I asked a collegue to help me out. The issue was a missing ending bracket in a string in JavaScript.

```
']'
```

## NB
The string was used to grab an element in a jQuery way `$("li[someProperty='" + someVar + "']")`.
It is interesting to note that the missing bracket caused no issue on any browser but Safari.