---
layout: post
title: "Foobarbot"
date: 2017-02-29 09:11:29
comments: false
---

**Foobarbot is a full-stack JavaScript application one of my classmates and I have written. The app was built using [Vue.js](https://vuejs.org/) on the frontend and [Node.js](https://nodejs.org/en/) on the backend.**

The purpose of this project was to learn about the [Express framework](https://expressjs.com/) and various Vue.js components such as the [vue-router](http://router.vuejs.org/en/) and [vuex](https://vuex.vuejs.org/en/). The application uses [mLab](https://mlab.com/) Database-as-Service and it was deployed on [Heroku](https://www.heroku.com/).

With Foobarbot users can register their profiles, log in, create code snippets (gists), tag them, and star (like) snippets uploaded by other users. The application is also using the [GitHub API](https://developer.github.com/v3/) to fetch Gists as search results, which are being saved to the app's own database whenever a user stars a given gist.

{% include cab.html text="Open on GitHub" link="https://github.com/gaboratorium/foobarbot" %}