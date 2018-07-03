---
layout: post
title:  "Debugging HpConf"
date:   2016-08-01 12:15:16 +0200
published: false
---
Today's learning:
 
 * If `HpConf` gets stuck but not really throws an error message, try to look for the exception handling, and throw the error.
 * When having initialization problems, the application can be restarted (re-initialized) by modifying the `Web.config` (build is not necessary).