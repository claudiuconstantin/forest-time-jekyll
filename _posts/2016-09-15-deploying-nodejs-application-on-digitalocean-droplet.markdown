---
layout: post
title: "Deploying Nodejs application on DigitalOcean droplet"
date: 2016-09-15 16:30:29
categories: posts
comments: true
tags: nodejs javascript
icon: code-fork
---
Tutorials I have went through during deployment:

  1. [How To Use SSH Keys with PuTTY on DigitalOcean Droplets (Windows users)](https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-putty-on-digitalocean-droplets-windows-users) 
  2. [Initial Server Setup with Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-14-04)
    - Root login
    - Creating users
    - Root priviliges
    - Public key authentication  
  3. [Additional Recommended Steps for New Ubuntu 14.04 Servers](https://www.digitalocean.com/community/tutorials/additional-recommended-steps-for-new-ubuntu-14-04-servers)
    - Firewall (allowing ports)
    - Timezones
    - NTP (allow your computer to stay in sync with other servers)
    - SWAP file
  4. [How To Install Node.js on an Ubuntu 14.04 server](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server)
    - Distro stable version (we are using this)
    - PPA
    - NVM
  5. [How To Use SFTP to Securely Transfer Files with a Remote Server](https://www.digitalocean.com/community/tutorials/how-to-use-sftp-to-securely-transfer-files-with-a-remote-server)
    - Navigating with SFTP in command line
    - Transferring files with SFTP
  6. [How To Set Up a Host Name with DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-host-name-with-digitalocean)
    - DO Domain servers
    - Configuring domain
  7. [How To Set Up a Node.js Application for Production on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)
    - Creating a NodeJS application
    - PM2
    - Installing Nginx as a Reverse Proxy Server
    - Installing  Let's Encrypt and Dependencies (in progress - at this point I need the digital ocean nameservers, which takes some time to be redirected)
  8. [pm2 calls node, not nodejs](https://www.digitalocean.com/community/questions/pm2-calls-node-not-nodejs) 
    - Creating an alias
    - `sudo ln -s "$(which nodejs)" /usr/bin/node`
  9. [How To Set Up Automatic Deployment with Git with a VPS](https://www.digitalocean.com/community/tutorials/how-to-set-up-automatic-deployment-with-git-with-a-vps)