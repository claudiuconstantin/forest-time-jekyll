---
layout: post
title: "How to log in to our droplet on DigitalOcean with PuTTY"
date: 2016-09-10 10:46:31
categories: posts
comments: true
tags: digitalocean putty 
---
> PuTTY is an open-source SSH and Telnet client for Windows. It allows you to securely connect to remote servers from a local Windows computer.

What we need:

  - Local computer Windows
  - One droplet on DigitalOcean running Linux

## Step one: installing PuTTY

We can get PuTTY from [here](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

## Step two: configuring PuTTY

When we open up `putty.exe` we will see a configuration screen. We will have to add our configurations for our server. 

![PuTTY Configuration Screen](https://pario.no/wp-content/uploads/2008/02/putty-configuration.jpg "PuTTY Configuration Screen")

`Host Name (or IP address)` is the one we can find on our dashboard on DigitalOcean.

Make sure port is set to `22` and `Connection type` is `SSH`.

Next go to `SSH` on the left sidebar, and check `Preferred SSH protocol version` to `2 only`.

Now we can save these changes so we don't have to set them everytime, by going to the `Session` (in the left sidebar), and under `Saved Sessions` type a name for the settings, and click `Save`. 

Press `Open` to open connection.

Alternatively, you can also connect through CL by `ssh root@IP_ADDRESS`.

Source: [How to log into your droplet with putty for windows users - DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-log-into-your-droplet-with-putty-for-windows-users)
