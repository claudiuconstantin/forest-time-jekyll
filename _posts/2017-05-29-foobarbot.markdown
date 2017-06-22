---
layout: post
title: "Foobarbot"
date: 2017-05-25 09:11:29
category: projects
permalink: projects/:title
platform: Web
icon: http://www.myiconfinder.com/uploads/iconsets/256-256-25d19272bc58056226f77270b80e3cf7.png
---

Foobarbot is a RESTful application I have written with a cooperation of one of my classmates. The site is built on full-stack JavaScript, using [Vue.js](https://vuejs.org/) on the frontend and [Node.js](https://nodejs.org/en/) on the backend. 

The purpose of this project was to learn about [Express](https://expressjs.com/) and various Vue.js components such as the [vue-router](http://router.vuejs.org/en/) and [vuex](https://vuex.vuejs.org/en/). The application uses [mLab](https://mlab.com/) database-as-service, and was deployed on [Heroku](https://www.heroku.com/).

The application is also using the [GitHub API](https://developer.github.com/v3/) to fetch Gists as search results, which are being saved to the app's own database whenever a user stars (=likes) a given gist.

The site is awailable on [GitHub](https://github.com/gaboratorium/foobarbot) and at [www.foobarbot.com](//www.foobarbot.com).

![Foobarbot]({{site.cdn_path}}/img/posts/2017-05-29-foobarbot/foobarbot.png){: .o-image--bordered}