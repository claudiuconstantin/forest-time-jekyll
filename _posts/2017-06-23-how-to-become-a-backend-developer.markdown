---
layout: post
title: How to become a Backend developer
date: 2017-06-23 09:11:29
published: false
---

My new job at [Shape](https://shape.dk) as a Backend Student Developer starts in August, so I decided to refresh and widen my knowledge in this field in advance. Instead of jumping right into a given language, I wanted to learn about the overall infrastructure as much as possible, so I have listed a few things I want to go through before I dive into any specific stack.

This post was written based on the following video which is highly recommended to watch: [2016/2017 MUST-KNOW WEB DEVELOPMENT TECH - Watch this if you want to be a web developer](https://youtu.be/sBzRwzY7G-k?t=12m33s) by LearnCode.academy. Also, the mindmap in the video can be found [here](https://coggle.it/diagram/Vz9LvW8byvN0I38x).

So let's cover the following topics:

1. Languages
2. General theory and techniques
3. Databases
4. Caching

## 1. Languages

The video starts off with listing the most popular languages and splitting them into three major categories. The guy in the video tells us that the easiest way is to choose a scripting language first, because their learning curve is relatively shallow and they are the most popular ones when it comes to jobs.

### Scripting languages

- Node.js (with express or hapi)
- Python (django, flask)
- Ruby (Ruby on Rails)
- PHP (Laravel, Symfony)

### Functional languages

- Elixir
- Scala
- Clojure
- Haskell

### High performance / Compiled languages

- Go
- Rust
- Java
- C#

Obviously, to cover as much as possible it is recommended to learn at least one language from each category, but probably not at the same time. As far as I am concerned, I have some experience with Node.js, PHP, Java and C#. Therefore, picking a functional language seems to be a good move, however as I said earlier, my main focus now is to learn about the infrastructure first (+ a little bit about DevOps), therefore for me Node.js takes this round due to its simplicity and popularity. After I have obtained the necessary environmental and theoritical knowledge and I feel confident enough to jump into something new, my next pick will be probably either Elixir or Scala.

## 2. General theory and techniques

- Unit / Functional testing
- API's / RESTful services
- Security (e.g.: SSL)
- Authorization / Authentication
  - OAUTH2
	- JSON Web Token
- SOA (Service Oriented Architecture) / Microservices
- Deployment and continuous integration
- WebSocket
- ORM (Object-relational mapping) / DataStructure / DAO (Data Access Object)

I feel the same as probably every programmer when they start-off; that coding is sexy, exciting and spectacular. However, setting up development environments and learning about the background theory is slow, dry and boring. 

However, no matter which language we choose, a backend developer has to be familiar with these terms. We can say that learning these is somewhat unavoidable, so this is where I will start as well. 

## 3. Database

- Relational: mySQL, PostgreSQL
- Redis / Sessions / Caching
- Document (NoSQL): MongoDB, Couchbase, RethinkDB
- Search Engine: ElasticSearch, Solr

## 4. Caching

- Nginx (Server)
- Apache (Server)
- Database (Redis)
- In-Memory

## The path of the developer

So what's the strategy here? There's much to learn, but as we know organization is the key to success. As far as I am concerned, I have created a Droplet at [DigitalOcean](https://www.digitalocean.com/) using the [GitHub Student Developer Pack](https://education.github.com/pack), which provides us a $50 coupon. I have set up this droplet WITHOUT any preconfiguration so all I had was a bare Ubuntu 16.04. And now, I take it from here, step by step. Here is a rough sketch for what I imagine as a possible path:

1. [Set up SSL connection (probably with [Let's Encrypt](https://letsencrypt.org/))]({{ site.baseurl }}{% post_url 2017-06-23-how-to-deploy-a-nodejs-app-with-ssl %})
2. [Deploy a simple Node.js application with Git]({{ site.baseurl }}{% post_url 2017-06-23-how-to-deploy-a-nodejs-app-with-ssl %})
3. [Run Node.js as a background service (using PM2)]({{ site.baseurl }}{% post_url 2017-06-23-how-to-deploy-a-nodejs-app-with-ssl %})
4. [ Set up Nginx as a reverse proxy server]({{ site.baseurl }}{% post_url 2017-06-23-how-to-deploy-a-nodejs-app-with-ssl %})
5. [Set up a complex continuous integration deployment]({{ site.baseurl }}{% post_url 2017-06-24-continuous-integration-with-jenkins %})
6. [Set up a unit / functional testing environment]({{ site.baseurl }}{% post_url 2017-07-06-unit-and-functional-testing-in-nodejs %})
7. [Set up a databse (preferably something we are not experienced with - in my case it's Redis)]({{ site.baseurl }}{% post_url 2017-07-15-redis-setup-with-nodejs %})
8. Implement ORM / DAO structure
9. Create an API with RESTful services
10. Create authentication

Huh, now this seems quite robust. Of course this list may change on the fly as currently I am not entirely clear with what WebSockets and SOA are good for. But it as for a starting point, it does the job perfectly.

## Bonus: some articles and questions to start with

Finally, I will put here some links and questions, which I found to be interesting and which I think will do good for future reference:

- What is the difference between a process and a thread?
- What is the difference between ORM and DAO?
- What is a Service Worker?
- [Tutorial: How to Deploy a Node.js App to DigitalOcean with SSL](https://code.lengstorf.com/deploy-nodejs-ssl-digitalocean/)
- [Single-Thread vs. Multi-Thread](http://www.reliasoft.com/BlockSim/multithread.htm)
- [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)
- [The Basics of Web Workers](https://www.html5rocks.com/en/tutorials/workers/basics/)
- [How To Set Up a Node.js Application for Production on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)
