---
layout: post
title:  "How to Bemify with Sass?"
date:   2016-08-15 13:43:16 +0200
categories: posts
comments: true
tags: bem css sass performance
published: false
---
## What is BEM?

BEM is a convinient way to write scalable CSS. Applying BEM methodology from the very start provides us an easy-to-follow, modular structure which also [renders really fast](https://css-tricks.com/efficiently-rendering-css/).

From [https://en.bem.info/methodology/](https://en.bem.info/methodology/):

> BEM methodology was invented at Yandex to develop sites which should be launched fast and supported for a long time. It helps to create extendable and reusable interface components.

## Refactoring existing CSS to apply BEM (Bemifying)

Following BEM principles from the first line of CSS is highly recommended, however it might happen that we already have some written and/or we are using some framework and we would like to improve on maintainability. In that case Bemifying is the way to go.

The issue with refactoring our CSS code is that it is strongly connected with our markup and logics. Refactoring something in multiple places and jumping back and forth between different files can be a pain in the butt, therefore a flat tecnique is required where we don't have to shift our attention from the CSS code.

Steps:

  1. Create alias eg.: `.login > h1 { ... }`
  2. Create BEM compatible element eg.: `.login__headline { ... } ` with css properties
  3. Extend alias with BEM elem eg.: `.login > h1 { @extend .login__headline; }`

## Create alias

First let's recreate the alias without nesting

```
	some code
```
## Create BEM compatible element

Sometimes simple renaming does the job and remove nesting if there are any

```
some code
```

## Extend alias with BEM

So we rely on actual BEM compatible elements, but we don't have touch our markup.

```
some code
```

The following structure is recommended (remember one ui elem per file):

```
// Block
	.block { ... }

// Modifiers
	.block--modifier01 { ... }
	.block--modifier02 { ... }

// Elements
	.block__element01 { ... }
	.block__element02 { ... }

// Original - block
	.login { @extend .block }

// Original - modifiers
	.login.green { @extend .block--modifier01 }
	.login.rounded { @extend .block--modifier02 }

// Original - elements
	.block > ul > li { @extend .block__element01 }
	.block > .greenLine > div { @extend .block__element02 }
```



