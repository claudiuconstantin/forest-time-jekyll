---
layout: post
title:  "How to Bemify with Sass?"
date:   2016-08-21 13:43:16 +0200
categories: posts
comments: true
tags: bem css sass performance
---
## What is BEM?

BEM is an intuitive way to write scalable CSS. Applying BEM methodology from the very start provides us an easy-to-follow, modular structure which also [renders really fast](https://css-tricks.com/efficiently-rendering-css/).

From [https://en.bem.info/methodology/](https://en.bem.info/methodology/):

> BEM methodology was invented at Yandex to develop sites which should be launched fast and supported for a long time. It helps to create extendable and reusable interface components.

## Refactoring existing CSS to apply BEM  with Sass (Bemifying)

Following BEM principles from the first line of CSS is highly recommended, however it might happen that we already have some written and/or we are using some frameworks (wich we would like to get rid of) and we would like to improve on maintainability. In that case Bemifying is the way to go.

The issue with refactoring our CSS code is that **it is strongly related to our markup and logics**. Refactoring something in multiple places and jumping back and forth between different files can be a pain in the butt (specially when testing & debugging), therefore a flat, step-by-step technique is required where we don't have to shift our attention from the CSS code.

With this technique we can **refactor our CSS and apply BEM without touching any HTML or JavaScript**. This comes very handy for testing, and when the CSS refactoring is done and tested, we can begin refactor our HTML and JS.

In the following example let's assume we have a login screen, with a login box and a signup box.

```
.login {
	...
	h1 { ... }
	h1.warning { ... }
	.email-field { ... }
	&.condensed { ... }
	&.condensed .email-field { ... }
}

.signup {
	.signup h1 { ... }
	.signup h2 { ... }
}
```


## Steps:
  1. Create a BEM structured, individual file
  2. Create an alias to remove nesting eg.: `.login > h1 { }`
  3. Create BEM compatible element eg.: `.login__headline { ... } ` with the properties
  4. Extend alias with BEM elem eg.: `.login > h1 { @extend .login__headline; }`

### 1. Create a BEM structured, individual file

I recommend to have 1 UI component / file. Therefore I would split the code above into 2 different files, as they are 2 different components: something like `c-login-box.scss` and `c-signup-box.scss` ([Why prefix it with `c-`?](http://gaboratorium.xyz/2016/08/04/itcss-inverted-triangle-css/)) Each of these files containing UI components should follow an easy to understand and standardized format. Start up with the following:

```
// Block
  // you will insert code here

// Modifiers
  // you will insert code here

// Elements
  // you will insert code here

// Original - block
  .login {
  	...
    h1 { ... }
    h1.warning { ... }
    .email-field { ... }
    &.condensed { ... }
    &.condensed .email-field { ... }
}

// Original - modifiers
  // you will insert code here

// Original - elements
  // you will insert code here
```


### 2. Create alias for nested elements

Our `.login` element is our block element, so it is in its place (--> no need for creating an alias). But `h1` element is nested, so it should be an element. Our code becomes

```
// Block
// Modifiers
// Elements

// Original - block
  .login {
    ...
    h1.warning { ... }
    .email-field { ... }
    &.condensed { ... }
    &.condensed .email-field { ... }
  }

// Original - modifiers

// Original - elements
  .login > h1 { ... }

```

### 3. Create BEM compatible element

Move the properties to a BEM compatible element.

```
// Block
  .c-login { ... }

// Modifiers

// Elements
  .c-login__headline { ... }

// Original - block
  .login {
    
    h1.warning { ... }
    .email-field { ... }
    &.condensed { ... }
    &.condensed .email-field { ... }
  }

// Original - modifiers

// Original - elements
  .login > h1 { }
```

At this point we have no relation between our old (`.login` and `.login > h1`) and new (`.c-login`, `c-login__headline`) elements, so we need to connect the dots.

### 4. Extend alias / original element with BEM element

This happens with the [`@extend` Sass command.](http://sass-lang.com/guide).

```
// Block
  .c-login { ... }

// Modifiers
  .c-login__headline { ... }
// Elements

// Original - block
  .login {
    @extend .c-login;

    h1.warning { ... }
    .email-field { ... }
    &.condensed { ... }
    &.condensed .email-field { ... }
  }

// Original - modifiers

// Original - elements
  .login > h1 { @extend .c-login__headline; }


```

## The final result

After going through all the elements and modifiers, our code should look like this:

```
// Block
  .c-login { ... }

// Modifiers
  .c-login--condensed { ... }

// Elements
  .c-login__headline { ... }
  .c-login__headline--warning { ... }
  .c-login__email-field { ... }
  .c-login__email-field--condensed { ... }

// Original - block
  .login { @extend .c-login; }

// Original - modifiers
  .login.condensed { @extend .c-login--condensed; }

// Original - elements
  .login > h1 { @extend .c-login__headline; }
  .login > h1.warning { @extend .c-login__headline--warning; }
  .login > .email-field { @extend .c-login__email-field; }
  .login.condensed > .email-field { @extend .c-login__email-field--condensed; }
```

At this point we have succesfully restructured our CSS and applied BEM without touching any HTML or JS. We can start testing, and if we are happy with the result we can continue on refactoring our next component, or jump to the markup or logics.

After succesfully refactoring our HTML and JS files, we can remove the *original* parts.

## Bemifying template

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
