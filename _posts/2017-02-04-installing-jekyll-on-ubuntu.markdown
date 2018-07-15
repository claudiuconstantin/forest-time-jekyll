---
layout: post
title: "Installing Jekyll on Ubuntu 16.04 LTS"
date: 2017-02-04 10:48:29
published: false
---

After juggling around with Ruby and Jekyll installation packages on Linux, I found a [comment being more helpful](http://askubuntu.com/questions/305884/how-to-install-jekyll#306177) than the official documentation.

1. `sudo apt-get install ruby-dev`
2. `sudo gem install jekyll`

After that, I still had one issue:

`Yikes! It looks like you don't have jekyll-sitemap or one of its dependencies installed.`

A simple `sudo gem install jekyll-sitemap` installed the required dependency, and everything was working like charm.