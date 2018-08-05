---
layout: post
title: Apache vs. Nginx
date: 2017-06-24 09:11:29
audiopost: true
---

I am completely new to [Nginx](https://www.nginx.com/resources/wiki/), so I decided to read a little about the differences of Apache and Nginx. So I started with [this video](https://www.youtube.com/watch?v=ZhfpYgl8BtQ) by Aleksey Grebeshkov, and the first thing Aleksey says is that approximately 70% of the web traffic is served by either Apache or Nginx, which is pretty impressive. Another video I have went through was [this one](https://www.youtube.com/watch?v=YWvmnRpVbbc) by CarAni Studio.

## Connection handling

Apache provides a variety of multi-processing modules (called MPMs) that handle clients' requests. These MPMs provide a flexible architecture for choosing different connection and request handling algorithms, however this flexibility comes at a cost of resource consumption.

Nginx however was designed to use an asyncrhonous, non-blocking, event-driven connection algorithm. It spawns worker processes, each of which can handle thousands of connections. This means, that Nginx scales very well, even with limited resources.

## Dynamic content 

The next difference is the dynamic content handling. Apache itselft can process dynamic content within the web server itself, without having to rely on external components. It means basically means that it can handle PHP scripts for example. Nginx can't process dynamic content. Instead, it will pass the content to be processed (the scripts) to an external processor for execution, and it will wait for the rendered content to be sent back.

## Distributed or centralized configuration

Apache allows additional configuration on a per-directory basis by interpreting directories in `.htaccess` files. This is useful, because it is possible to allow non-priviliged users to control certain aspects of their website without granting them persmissions to edit the main config file.

Nginx unfortunately does not provide any mechanism for per-directory configuration.

## Modules

Both Apache and Nginx are extensible through module systems. Apache module system allows us to dynamically load or unload modules, meanwhile Nginx modules must be selected and compiled into the core software, so they are not dynamically loadable.

## Using Apache and Nginx together

It is possible to leverage both Apache's and Nginx's benefits by using both at the same time, by puttin Nginx in front of Apache by using it as a reverse proxy. The benefit of this setup is that Nginx will handle all requests coming from clients, which takes advantage of Nginx's fast processing speed and ability to handle a large number of connections simultaneously. For static content handling Nginx can be responsible, and for dynamic content handling (such as PHP) Nginx can proxy the request to Apache where the content can be processed and rendered.

