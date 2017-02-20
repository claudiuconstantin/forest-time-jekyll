---
layout: post
title:  "Dry CSS: mixins or extends?"
date:   2016-07-26 20:25:16 +0200
categories: posts
comments: true
tags: css
icon: code-fork
---
I have been doing some research on CSS optimization lately so I bumped into an apparently popular question about mixins and extends: which of these 2 seemingly powerful tools of Sass should we use and when?

## DRY principle: do not repeat yourself
In short, mixins can be created to hold up a number of rules, so whenever we include one of these mixins, the preprocessor will include (=paste) those lines of code to that exact place, which leads to repetition.

Extends (or placeholders) work in a different way; whenever we use an extend rule, the given selector will be placed next to the extended selector, which may save up a lot of lines of code, but also leads to a very fragmented buildup (if you are not familiar with SASS, [this is the place to go](http://sass-lang.com/guide)).

There are a number of articles out there ([here](https://www.sitepoint.com/avoid-sass-extend/) and [here](http://vanseodesign.com/css/sass-mixin-or-extend/)) explaining why extends suck, but there is one I would like to highlight, and that is [from Harry Roberts](http://csswizardry.com/2014/11/when-to-use-extend-when-to-use-a-mixin/), who points out the real purpose of DRY:

> Repetition in a compiled system is not a bad thing: repetition in source is a bad thing.

In that sense we can agree that using mixins (even without variables) will still be able to keep our code dry. The question is however: what performance issues may we face? To answer that, [Shay Howe did a very interesting experiment](https://tech.bellycard.com/blog/sass-mixins-vs-extends-the-data/): turned out thanks to Gzip, the more repetition we have in our file the better the compression will be. Very impressive.