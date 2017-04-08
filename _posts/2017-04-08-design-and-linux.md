---
layout: post
title: "Design and Linux"
date: 2017-04-08 10:11:29
categories: posts
comments: true
icon: linux
tags:  linux
---

I always seek for aesthetics. Since I have been using Ubuntu as my main OS I've been fairly happy with it, but let's face it: poor guy is quite ugly by default. I know, I know... Linux is not meant to be for the general consumer market, and most of the Linux guys don't care about how it looks. Design has never been really a priority in this segment of users.

I tried to share this attitude. I tried not to care about the lack of aesthetics, tried to ignore my desire of looking at something nice, and I tried to focus only on the bits and not the pixels. But appearantly I couldn't resist too long, because today I decided to hack my way through to visual satisfaction.

[![Ubuntu](http://www.unixmen.com/wp-content/uploads/2014/04/Menu_003.png)](http://www.unixmen.com/wp-content/uploads/2014/04/Menu_003.png)
*Something dies inside me everytime I look at this.*

I like to work in nice environment, with nice tools. I like symmetry. I like minmalism and white-space. I often find myself fiddling with design a lot. If you knew how much I have changed the look of this blog... for some weird reason, the right amount of white-space, equal padding and perfect line-height give me the chills.

Just for fun, let's compare the image previously showed with another one exposing the exact same functionality.

[![Ubuntu](https://cdn.pbrd.co/images/1SEtvynjr.png)](https://cdn.pbrd.co/images/1SEtvynjr.png)
*This is somewhat closer to something I would call "the search"*

This is of course just one example out of many, which may be completely irrelevant for some and I get that. But hey; if we have the option of working with something nicer, cleaner and simpler which is not only easy on the eye, but also improves cognition and therefore helps work, which by the way happens to be free, then why wouldn't we do that?

There are [some serious initiatives](https://elementary.io/) in this direction of the open-source sphere, which are nice to see. I have tried elementary out a couple of times, but unfortunately I didn't have luck with it, but it might have been just me.

The problem with this whole design thing around Linux is that it is not that well documented. Why? As we know, one of the traits of an open-source system is that it can be completely customized and that it is community driven. This should imply that among thousands of designs the best ones should be raised to the top creating us a beatiful operating system. And yet, one of the most popular OSes has *that* search design you just saw on the first picture.

The thing is, if someone wants to contribute in this field of the community, he has to represent two different kinds of attitude; he has to be a developer (hey, you are using Linux) and also a designer (hey, you are trying to design) which I guess is rare.

There are indeed thousands of themes, icon-packs available for download. But depending on your hack skills and motivation, it might be cumbersome to configure them the right way. And by the right way I mean that it does not feel hacky or crappy.

Here is my setup, which I tried to make as clean and minimalistic-but-yet-functional as possible.

[![Ubuntu](https://cdn.pbrd.co/images/bzOqtdis.png)](https://cdn.pbrd.co/images/bzOqtdis.png)
*Still Ubuntu: but this time with GNOME, Flat-Plat, Docky and elementary Icons*

The very first step was to get rid of Unity and [replace](http://askubuntu.com/questions/781559/using-gnome-in-ubuntu-16-04-lts) it with [GNOME](https://www.gnome.org/). GNOME is an open-source desktop environment, [which has way less clutter than Unity by default](https://www.gnome.org/gnome-3/), but its power comes from its customizability. A dedicated "package manager" called [Gnome Extensions](https://extensions.gnome.org/) lets us easily one-click-install any modifications we need; which of I am going to name 2 right away.

**Hide Dash** is an extension for... hiding the Dash. When we open the Activities overview (the "search window") there is a dock-like panel called Dash on the left side of the screen which I found to be useless, as I am using [Docky](http://wiki.go-docky.com/index.php?title=Welcome_to_the_Docky_wiki) instead (the intellihide behaviour is really sweet).

Another good one called **Pixel saver** simply removes the title bar of a window when it gets maximized.


Imagine that as I start using GNOME, I realize that it really disturbs me that maximized windows have those useless title bars, which take up whole lines for no reason. Imagine that I google this, find an Install button which actually works and does exactly that funky function I needed, and the package gets listed natively in the OS. That is satisfaction.

I also would like to point out right away, that the very first two extensions I have installed and described previously do the same things: they remove stuff. Even GNOME, which has a way cleaner UI than Unity had some clutter I wanted to get rid of. This is not rare; in many-many cases the first steps of my customization of any given tool or product are the clutter removals.

[![Ubuntu](https://cdn.pbrd.co/images/1S2fl3dEk.png)](https://cdn.pbrd.co/images/1S2fl3dEk.png)	
*With GNOME extensions we can customize our desktop experience the way we want; just like in Atom or Visual Code*

I would like to highlight a beautiful GTK theme, called [Flat-Plat](https://github.com/nana-4/Flat-Plat). I woud have never thought that Material Design could look this good on a desktop operating system.

And last but not least, let me show my apprecation for [elementary Icons](https://github.com/elementary/icons). Well crafted, simple icons, which don't feel either too old or too flat.

[![Ubuntu](https://cdn.pbrd.co/images/1UWz80tNU.png)](https://cdn.pbrd.co/images/1UWz80tNU.png)
*In GNOME, pressing the Super key (Windows key) opens the Activities view which is a Window management and Quick Search view at the same time*

Of course, this setup comes at a cost. What if one of the extensions gets deprecated meanwhile the OS pulls a new update? It might happen and we are on our own; at this point apparently the only way of working in an appealing environment for those who care about design is either by paying for it in the shape of let's say Apple products, or by maintaing it ourselves. The good thing is that both options are available, and it's up to us which path we choose.


## Some other tweaks

- Path for custom themes and icons: `/usr/share/themes/`, `/usr/share/icons`. Use the (Gnome) Tweak Tool to apply these styles.
- [Removing Anchor icon in Docky](http://askubuntu.com/questions/4942/remove-the-anchor-icon-in-docky)
- [GConf](https://projects.gnome.org/gconf/)
