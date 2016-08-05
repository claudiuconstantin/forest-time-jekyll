---
layout: post
title:  "ITCSS - Inverted Triangle CSS"
date:   2016-08-04 14:13:16 +0200
categories: posts
comments: true
tags: css sass performance
---
[Inverted Triangle CSS](https://speakerdeck.com/dafed/managing-css-projects-with-itcss) is a technique for developing easily maintainable CSS introduced by [Harry Roberts](http://csswizardry.com/).

## About ##
CSS is easy to write but can easily become hard to maintain as our app scales. ITCSS solves this maintainibility issue with an approach of taking care of the [specificity graph](http://csswizardry.com/2014/10/the-specificity-graph/) of the CSS codebase.

![Specificity Graph](http://cdn-images-1.medium.com/max/1200/0*xGvZmx1u2K8D_ajm.png "specificity-graph")

### The structure
ITCSS introduces layers with increasing specificity. This structure should be flat, meaning no imports should be present outside `app.scss`.

 - **Settings**: Only vars, does not output anything
 - **Tools**: Only mixins, helper functions, placeholders. Does not output anything.
 - **Base**: Only tag selectors `h1`, `p`, `ul` etc. No classes.
 - **Objects**: Components with class selectors, preferably with high layout impact, eg.: `o-grid`, `o-panel`, `o-modal`.
 - **Components**: UI Components with class selectors, preferably with high cosmetic impact, eg.: `c-designeditor`, 
 - **Themes**: This layer should only exist when we have multiple versions of partials overwriting the same default rulesets, which are intended to be delivered to the clients exclusively (eg.: `customer01` gets `theme08` meanwhile `customer02` gets `theme32`).
 - **Trumps**: !important flags

### Difference between components and objects
Originally the `objects` layer was created for [Object-Oriented CSS](http://oocss.org/) (hence the name), and could be ignored. However the idea of differentiating between layout-driven and visual-driven elements is benefitial enough in terms of categorizing and thinking about the purpose of each element to keep it.

Some inheritance relationship may be in play (eg.: `c-designeditor` is a `o-panel`, `c-helpbox` is a `o-modal`), but not exclusively.

## Development ##

### Converting checklist
Whenever implementing new CSS or converting existing CSS into ITCSS these steps may serve as guidence:

 1. Can it be a modifier? Check for own solution and add as a modifier if possible
 2. If we are using a framework --> Is it implemented in our framework? Check for module and convert it into ITCSS if possible
 3. New component --> new file
 4. Choose the right layer(s)
 5. Use ITCSS prefixing and BEM.

#### 1. Adding as a modifier
Adding an element as a modifier of an existing one is suitable when the element can be implemented with the base block element + some its modifiers without changing the majority of the base elements' rules (To read about block elements and modifiers: [BEM](https://en.bem.info/)).
**This compels code recycling**. 

#### 2. Converting our framework to ITCSS
**ITCSS is designed to be structure without frameworks.** Many frameworks (the most popular ones at least) weights a lot (~166kb), and most of its components are often not even being used, and those which are, are often gets overwritten by our custom rules. These frameworks once we have them, should serve as a helpers in implementation, but in this setup we cannot rely on them because of their complexity and incompatibility.

Recommended way of conversion:

 1. Import the framework module by module, ignore them in production
 2. In development, locate elements you wish to implement
 3. Implement the solution by inserting the partials to the corresponding layers
 4. Comment out the framework module again
 5. Test

#### 3. One block element, one file
Always apply [BEM methodology](https://en.bem.info/) (`block-name`, `block-name__element`, `block-name--modifier`). One file should always contain only one block, its elements and modifiers, and should follow the following pattern:

```
// Block
c-component-name {
	...
}

// Modifiers
c-component-name--modifier1 { ... }
c-component-name--modifier2 { ... }

// Elements
c-component-name__element1 { ... }
c-component-name__element1--modifier1 { ... }
c-component-name__element2 { ... }
c-component-name__element1--modifier2 { ... }

// Original - block
.component { @extend c-component-name }

// Original modifiers
.component.modified { @extend c-component-name--modifier1 }

// Original elements
component > ul > li { @extend c-component-name__element1 }
component > ul.modified > li { @extend c-component-name__element1--modifier1 }

```

Try to keep files small, and not to exceed LN 200.

#### 4. Using the right layers
 - Never use tag selectors outside the **base layer**. 
 - Never use important flags outside the **trumps layer**.
 - **Component vs Object?** Generally speaking, UI Components should be implementend in a layout independent way. Unless the subject of the implementation *has only layouting purposes which are meant to be reused in various places*, it should be fine to create it as a new component. 
 

#### 5. ITCSS prefixing
ITCSS prefixing means prefixing our classnames with either `c-` or `o-` depending wheter the element is a component or an object. This has 2 purposes:

 - Indicate that that elem has been ITCSSed (and BEMed).
 - Make it easier to read markup and scope our elem when needed.

The transition from original class name to the new one can be easily achieved without touching the markup and javascript with `extend`s:

```
.o-panel {
    display: block;
    position: absolute;
    z-index: 100;
    overflow-y: auto;
    display: none;
}

.o-panel--active {
	display:block;
}

//Foundation references (as is in HTML and JS)
.panel { @extend .o-panel; }
.panel.is-active { @extend .o-panel--active; }
```

*Note that this refactoring besides changing the class names reorganizes the structure to fit BEM.*
This is however a temporary solution for testing purposes, as the ultimate goal is to make the change everywhere.

### Supervision
NPM packages and commands `analyze-css` ([GitHub](https://github.com/macbre/analyze-css)), `specificity-graph` ([GitHub](https://github.com/pocketjoso/specificity-graph)) can be and should be used to inspect the CSS codebase in an extensive overview.
