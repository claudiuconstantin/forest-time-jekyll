---
layout: post
title:  "Star Wars: Card Game"
date:   2016-08-01 12:15:16 +0200
categories: project
comments: false
---

Star Wars: Card Game is a JavaScript game I wrote for the course Casual Games at Copenhagen School of Design and Technology. I've been always a huge fan of board games and at the time, I was also a big fan of Hearthstone, so I've decided to write my own card game. Choosing Star Wars as the main theme seemed to be an obvious choice: first of all, I love Star Wars, and second, I could easily find a lot of resources for the game. 

{% include image.html file="swcg-menu.png" alt="Early design for the main menu" %}

Unfortunately when I moved the game to a new repo for cleaning purposes, I failed to check-in the assets folder of the game, and as a result I've lost all the graphics and sounds of the game. However I didn't want to let this relic disappear in the void, so I've spent a couple of hours trying to replicate the original version and bring the code back to a playable level.

{% include image.html file="swcg.png" alt="Early design for the gameplay" %}

## The rules

I'd like to give a few words about the rules, as they are not very well explained in the game. 
- The game can be played by 2-4 players in hot seat mode.
- The goal of the game is to kill your opponents.
- The players share a common hand.
- In each turn, a player chooses a card to play.
- After he played the card, each of his units attack (except the one he just played).
- If the opponent has a unit on the opposing spot, that unit takes the damage. 
- If the opponent has no unit on the opposing spot, the damage goes directly to the opponent.
- The game proceeds until there is one man standing.

{% capture url %}
{{ site.baseurl }}/apps/swcg
{% endcapture %}

{% include cab.html text="Play Star Wars: Card Game" link=url %}