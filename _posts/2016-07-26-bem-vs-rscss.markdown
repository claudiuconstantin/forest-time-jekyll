---
layout: post
title:  "BEM vs RSCSS"
date:   2016-07-26 20:24:16 +0200
categories: posts
comments: true
tags: css
---
I have stumbled upon a “stylesheet structure” called [RSCSS (Reasonable System for CSS)](https://github.com/rstacruz/rscss), which is basically a set of rules regarding how to write highly maintainable CSS. Meanwhile I like the extra rules, the naming convention is pretty much BEM, only with different syntax.

Single word selectors or selectors with only a hyphen indeed do look better, however BEM has been so popular, I did some research on what possible effects differences may cause and I found something interesting.

As [Jens K. highlights](https://www.designernews.co/stories/43322-rscss), browsers read right-to-left; they parse the selector first and then its relations, meaning e.g.: when a class name `form` is being parsed, the browser will look for all the `form` elements within the document, and only then will apply the changes.

So instead, if we use a less generic class name, such as `login-box__form` the browser likely will find significantly less results to deal with (= decide whether apply changes or not).

Despite the fact that easily readable class names do look better, unique class names result better performance.