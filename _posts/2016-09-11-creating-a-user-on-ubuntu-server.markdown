---
layout: post
title: "Creating a user on Ubuntu 14.04 server"
date: 2016-09-11 17:04:45
categories: posts
comments: true
tags: linux
icon: linux
---
  1. Connect as root `ssh root@9IP_ADDRESS`
  2. New user: `adduser username`
  3. Adding to `sudo` group: `gpasswd -a usaername sudo`
  4. Try to log in with `ssh username@9IP_ADDRESS`
  5. Generate new SSH key if needed with `ssh-keygen`
  6. A. Copy the public key with `ssh-copy-id username@SERVER_IP_ADDRESS`
  7. B1. If the command above does not work for copying the SSH key, console log your ssh `cat ~/.ssh/id_rsa.pub`, copy it
  8. B2. On the server switch users with `su - username`
  9. B3. Create a new folder and restrict its permissions with: `mkdir .ssh` and `chmod 700 .ssh`
  10. B4. Open a file in .ssh called `authorized_keys` with a text editor e.g.: `nano .ssh/authorized_keys`
  11. B5. Insert your key
  12. B6. `CTRL + X` to exit the file, then `Y` to save changes.
  13. B7. Restrict the permissions of the `authorized_keys` by `chmod 600 .ssh/authorized_keys`
  14. B8. Type `exit` to return to `root` user.

Now you may SSH login as your new user, using the private key as authentication.

Source: [Initial Server Setup with Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-14-04)