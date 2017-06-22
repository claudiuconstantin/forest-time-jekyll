---
layout: post
title: "Creating shell script shortcuts on the launcher"
date: 2017-03-06 10:11:29
---

I have downloaded a couple of applications lately (Android Studio, libGDX, Burp, other Java apps) which had to be initialized from the Terminal, and I was okay with it, but after a while it became rather tiring and cumbersome. So, I've looked up how to create shell script shortcuts in Ubuntu and put them on the launcher, and I found the answer here: [Ask Ubuntu: How to add a shell script to launcher as shortcut](http://askubuntu.com/questions/141229/how-to-add-a-shell-script-to-launcher-as-shortcut)

First, create `*.desktop` file in `/usr/local/share/applications/` with:

```bash
sudo -i gedit /usr/share/applications/name.desktop
```

Then paste the following text and edit accordingly:

```bash
[Desktop Entry]
Type=Application
Terminal=true
Name=unmount-mount
Icon=/path/to/icon/icon.svg
Exec=/path/to/file/mount-unmount.sh
```

Now we just need to put this command on the launcher by dragging it from the files manager.