---
layout: post
title:  "How to setup Sauce Connect"
date:   2016-08-02 10:20:16 +0200
---
Sauce Labs is a testing cloud for web and mobile. With [Sauce Connect](https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy) we can test local installments.

> Sauce Connect™ is a proxy server that opens a secure connection between a Sauce Labs virtual machine running your browser tests, and an application or website you want to test that's on your local machine or behind a corporate firewall. 

## Setting up Sauce Connect
  
  1. [Download Sauce Connect](https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy)
  2. Establish a Sauce Connect tunnel:

```
bin\sc -u YOUR_USERNAME -k YOUR_ACCESS_KEY
```

Ta-da!