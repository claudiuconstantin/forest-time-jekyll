---
layout: post
title:  "Space Invaders"
date:   2016-08-01 12:15:16 +0200
categories: project
comments: true
audiopost: true
---

**Space Invaders is a JavaScript game I wrote for the course Casual Games at Copenhagen School of Design and Technology.**

The game is very simple: the player can move the spaceship using the cursor buttons and can fire using the spacebar. The goal of the game is to survive as long as possible: we can lose lives by crashing into aliens and meteoroids or by letting aliens reach the bottom of the screen. As the game proceeds, aliens and meteoroids speed up gradually, therefore the game gets harder and harder.

Pro tip: meteoroids can be exploded by firing enough bullets at them. Sometimes they have a surprise for you.

The game was written using the [CreateJS](https://createjs.com/) libraries.

{% capture url %}
{{ site.baseurl }}/apps/space-invaders
{% endcapture %}

{% include cab.html text="Play Space Invaders" link=url %}