---
layout: post
title: "Installing XAMPP (LAMPP) on Ubuntu 16.04"
date: 2017-02-04 09:48:29
categories: posts
comments: true
tags:  linux
---

Installing XAMPP on Linux can be a bit tricky. First, let's download the package from [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html).

## Install

Then, we might have to change the permissions to be able to execute the installer. We can do that with:

```python
chmod 755 xampp-linux-*-installer.run 
# or
sudo chmod 755 xampp-linux-*-installer.run 
```

Make sure to replace the `*` with your version number. Then, run the installer with:

```python
sudo ./xampp-linux-*-installer.run
```

## Run

To start and stop XAMPP use:

```python
# to start
sudo /opt/lampp/lampp start

# to stop
sudo /opt/lampp/lampp stop
```

Alternatively, we can use a GUI as well:

```python
cd /opt/lampp

sudo ./manager-linux.run (or manager-linux-x64.run)
```

## Serving files outside of htdocs

I stumbled upon the issue that I could not work from the `htdocs` folder as this folder did not have the right permissions. Instead of changing the file permissions of this folder, I decided to change the **path** of the virtual host.

We can do that in  `/opt/lampp/etc/httpd.conf` , look for the following lines (around LN 229):

```python
DocumentRoot "/opt/lampp/htdocs"
<Directory "/opt/lampp/htdocs">
```

Try to change those paths to the desired ones. We won't be able because of the file permissions.

Fortunately, as a super user we have the right to change the file permissions. Open the terminal in this folder and simply type:

```python
sudo chmod 777 httpd.conf
```

We just changed the file permissions of the file, so now we are able to change the content of the file. 

## Testing

To test if everything works as intended, we can create a simple php file in our virtual host folder with one line in it: `<?php echo "If you see this message, your server is up and running!" ?>`.  Run XAMPP, and go to `localhost`.  If we see the message, we have set up the development environment correctly.

## Resources

- [XAMPP FAQs for Linux](https://www.apachefriends.org/faq_linux.html)
- [Changing Linux File Permissions](http://www.linuxclues.com/articles/16.htm)