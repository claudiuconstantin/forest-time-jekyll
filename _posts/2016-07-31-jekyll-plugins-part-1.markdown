---
layout: post
title:  "Jekyll plugins part 1"
date:   2016-07-31 10:45:16 +0200
categories: posts
comments: true
tags: random 
---
## 1. Installing a plugin
I wanted to fire up the [jekyll-seo-tag plugin](https://github.com/jekyll/jekyll-seo-tag). It is a plugin which generates the header for you having some SEO in it.
I followed the installation guidence (created a Gemfile and updated my _config.yml and header) without any success.

When I run `jekyll serve` or `jekyll build` I got the following: 
```
Liquid Exception: Liquid syntax error (line 28): Unknown tag 'seo' in _includes/head.html, included in _layouts/default.html
```

## 2. Ruby gem management
I found [Bundler](bundler.io/) the "The best way to manage a Ruby application's gems", maybe it's some kind of Bower for Ruby.
I install it in the hope that it will handle and manage gems for me.

I run `bundle install`, installs a lot of packages , which makes me wonder how could the site work until this point without these gems installed?

Running `bundle exec jekyll serve` gives me the exact same error. But there are some news, building the site without bundle (`jekyll build`) now gives another one:

```
Dependency Error: Yikes! It looks like you don't have kramdown or one of its dependencies installed. In order to use Jekyll as currently configured, you'll need to install this gem. The full error message from Ruby is: 'cannot load such file -- kramdown' If you run into trouble, you can find helpful resources at http://jekyllrb.com/help/!
```

Kramdown is a markdown converter and is part of Jekyll by default.

So Bundler instead of fixing my bugs introduced another ones. Maybe I don't have these gems installed globally?

## 3. RubyInstaller
I have downloaded [RubyInstaller](http://rubyinstaller.org/). Then I run `gem install jekyll-seo-tag` and `gem install kramdown`. I got `Successfully installed jekyll-seo-tag-2.0.0`.

Trying to build again, now I got new errors ([so we are happy](https://www.devrant.io/rants/17426)):

```
GitHub Metadata: No GitHub API authentication could be found. Some fields may be missing or have incorrect data.
  Liquid Exception: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed in _includes/head.html, included in _layouts/default.html
```

Apparently now the seo tag plugin needs some configuration. I add the `repository: gaboratorium/gaboratorium.github.io` line to `_config.yml`. Still no success, I found that [GitHub Pages gem has to be installed](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/#keeping-your-site-up-to-date-with-the-github-pages-gem). 

I run `gem install github-pages`, it installs. Update it, nothing happens.
Just in case I do `bundle update github-pages`, it updates.

Still `No GitHub API authentication could be found.`. I don't even understand why I need GitHub Api when I just try to run this thing locally?

I have a look at my Gemfile, found the line `gem 'github-pages', group: :jekyll_plugins`, I comment it out. Try to build again. It is running! Check the source code and my SEOed head is in place. Yay!

## Questions I have left
 - Since I have installed Bundler the only way to use jekyll commands is to prefix them with `bundle exec`, why is that?
 - GitHub Pages gem is not working correctly. How to set up authentication correctly?

These are the things I will look up soon, but now I have to go get some breakfast.
