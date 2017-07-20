---
layout: post
title: How to deploy a Node.js app with SSL
date: 2017-06-23 09:12:29
---

In this post I am going to deploy a Node.js application to a DigitalOcean droplet with SSL. [This post is a copied and shortened version of the original tutorial written by Jason Lengstorf](https://code.lengstorf.com/deploy-nodejs-ssl-digitalocean/) extended with my comments and remarks, but make sure to check the original post as well.

The end result may be not that spectacular, but will be rather satisfying I promise: [https://kudos.gaboratorium.com/](https://kudos.gaboratorium.com/)

## Prerequisites

- DigitalOcean droplet
- A domain name that we can modify DNS records for

I am going to assume that we have already set up a user on our server which uses SSH to connect. If you don't have it (you don't have other user than root), make sure to check out the link mentioned above.

## Disabling password login

> Since every server has a default `root` account that’s a target for automated server attacks — and because that account has unlimited power inside the server — it’s a good idea to make sure no one can use it.

Open the SSH configuration file for editing: 

```
sudo nano/etc/ssh/sshd_config
```

Change `PermitRootLogin yes` to `PermitRootLogin no`, and set `PasswordAuthentication no` as well. Then, we have to restart the SSH service:

```bash
sudo systemctl reload sshd
```

## Set up a basic firewall

We are going to set up a firewall which denies all traffic except through standard web ports which are `80` for HTTP, `443` fot HTTPS, and we are going to allow SSH logins. 

To do so, we are going to use these four commands:

```bash
# Enable OpenSSH connections
sudo ufw allow OpenSSH

# Enable HTTP traffic
sudo ufw allow http

# Enable HTTPS traffic
sudo ufw allow https

# Turn the firewall on
sudo ufw enable
```

To check the status of the firewall, we can run `sudo ufw status`.

## Install git

We are going deploy our application using git, which we are goint to install using `apt-get`.

```bash
# Install git
sudo apt-get install git

# Validate that it has been installed
git --version
```

## Install Node.js

We can specify which version of Node.js we wish to install. To tell `apt-get` that we would like to install the latest `6.x` release, we can use the following:

```bash
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
```

Otherwise, if we do not use the command above, `apt-get`'s default Node.js version will be installed, so you might want to check that out. For more information check out [NodeSource](https://github.com/nodesource/distributions).

Then, we can simply install Node.js:

```bash
# Install Node.js
sudo apt-get install nodejs

# Validate that it has been installed
node --version
```

## Cloning the app

Now, we are going clone our app to the server. If you don't have a repository yet, just create one right away quickly and use this small Node.js application:

```javascript
var http = require('http');

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World from Nodejs!');
    console.log("Listening on port 80...");
}).listen(80);
```

It does not matter where we install our app, so let's create an `apps` directory in our user`s home folder.

```bash
# Make sure we are in our home folder
cd ~

# Create directory and move into it
mkdir apps
cd apps

# Clone our app
git clone https://github.com/YOURUSER/YOURREPO
```

We can easily test if it works by simply running it by (assuming that our app is saved into a `server.js` file):

```bash
# Move
cd YOURREPO

# Start the app
sudo node server.js
```

Our app listens at `localhost:80` so we can test if it's working by opening a new Terminal session, logging into our server and making a `curl` request to the app like so:

```bash
curl http://localhost:80/
```

We should see the `Hello World from Nodejs!` message.

## Starting the app using a Process Manager

> Simply starting the app manually is technically enough to get the app deployed, but if the server restarts, that means we have to manually start the app again.

We are going to use a process manager called [PM2](http://pm2.keymetrics.io/) to run our app.  It allows us to start the app automatically when the server restarts.

To install PM2, we are going to use `npm`:

```
sudo npm install -g pm2
```

Note: `-g` stands for "globally", which is required in this case to make PM2 work properly.

## Running the app with PM2

```bash
# Make sure we are in our app's directory
cd ~/apps/YOURREPO

# Start the app with PM2
pm2 start server.js
```

Notice, that now the app is running without locking up our session. In the very same session we can run `curl http://localhost:80` to make sure that our app is running as expected.

If we encounter any issues (which I did), we can have a look at our log files:

```bash
#  My app name is `server`, replace it with yours
pm2 logs server
```

It might happen that we run into issues if we are not running `pm2` as `root` but another user; in this case we have permission issues. Unfortunately I did not manage to resolve this solution other way than simply running the command as `root`. For further information and discussion see this [GitHub thread](https://github.com/Unitech/pm2/issues/1321).

```bash
# Change user to root
su - root

# Go to app folder
cd /home/YOURUSERNAME/apps/YOURAPP

# Run app with PM2 - replace server.js with your file
pm2 start server.js

# Check if status is online
pm2 show server

# We can go back to our previous user
su - YOURUSERNAME

# Check if app is running
curl localhost
```

## Automatic app restart on server restart

To make sure that our application will be restarted when the server is restarted, we have to set some configurations.

```bash
pm2 startup systemd

[PM2] Init System found: systemd
[PM2] You have to run this command as root. Execute the following command:
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u gaboratorium --hp /home/gaboratorium
```

PM2 prints out a command that we need to run using `sudo`. However, it you had the same issues as I had, it might be a good idea to run `pm2 startup systemd` as a root.

We can then confirm and save the process list by `pm2 save`.

## SSL Encryption

To install `letsencrypt` we will first install some tools that Let's Encrypt depends on, then we are going to clone the `letsencrypt` repo to our server.

```bash
# Dependencies for Let's Encrypt
sudo apt-get install bc

# Clone the Let's Encrypt repo
sudo git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt
```

We have to now configure our domain to point to our server. Log in to your DNS provider (mine is GoDaddy for example), and add an A record for our domain that points to our droplet's IP address.

To check that the domain is pointing to our droplet, we have to run the following:

```bash
dig +short app.example.com
# Output should be the droplet's IP address
```

## Generating the SSL certificate

Now that the domain is pointed to our server, we can generate the SSL certificate:

```bash
# Move into the Let's Encrypt directory
cd /opt/letsencrypt

# Create the SSL certificate
./certbot-auto certonly --standalone
```

The tool will run for a while, and than it will ask for an admin e-mail address, we will have to agree to the terms, and specify the domain name. Once it's done, the certificate will be stored on the server for use with our app.

Our certificate will be valid for 90 days. Fortunately there is an easy, one-step command to renew certificates:

```bash
/opt/letsencrypt/certbot-auto renew
```

However, we do not want to run this command manually every 90 days, after all, we are programmers. We are going to use a built-in tool called `cron` to handle the renewal automatically.

Let's edit the server's `cron` jobs:

```bash
sudo crontab -e
```

After that, we get to choose a text editor, so let's choose `nano`. Let's add two new lines to the end of the file: 

```bash
# Tell cron to run the renewal command, with the output logged
# so we can check on it when necessary, every Monday at 1 in the morning.
00 1 * * 1 /opt/letsencrypt/certbot-auto renew >> /var/log/letsencrypt-renewal.log

# Restart Nginx at 01:30 to make sure the new cert will be used
30 1 * * 1 /bin/systemctl reload nginx
```

Save and exit by pressing `control + X` then `Y` then `enter`. We didn't set up Nginx yet, but we are going to do it in a minute.

## Install Nginx 

What is Nginx? Quoted [from its own site](https://www.nginx.com/resources/glossary/nginx/):

> NGINX is open source software for web serving, reverse proxying, caching, load balancing, media streaming, and more. It started out as a web server designed for maximum performance and stability. In addition to its HTTP server capabilities, NGINX can also function as a proxy server for email (IMAP, POP3, and SMTP) and a reverse proxy and load balancer for HTTP, TCP, and UDP servers.

We will use Nginx as a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy), so let's get started by installing it the regular way:

```bash
sudo apt-get install nginx
```

However, if something is holding port `80`, that may cause issues, so make sure you have turned `apache` (or `apache2`) and `pm2` off.

If we already have tried to install nginx, we may try to remove all its components first and reinstall it:

```bash
sudo apt-get remove nginx* && sudo apt-get install nginx-full
```

## Make all traffic is served over SSL

We will add a redirect for any non-SSL traffic to the SSL version. To do this, we will need to edit the NGINX's configuration files.

```bash
sudo nano /etc/nginx/sites-enabled/default
```

Let's delete everything, and add the following:

```bash
# HTTP — redirect all traffic to HTTPS
server {
    listen 80;
    listen [::]:80 default_server ipv6only=on;
    return 301 https://$host$request_uri;
}
```

Now we can save and exit.

## Create a secure Diffie-Hellman group

We are now going to use a strong [Diffie-Hellmann group](https://supportforums.cisco.com/document/6211/diffie-hellman-dh), which helps to ensure that our secure app stays secure.

Let's run the following command:

```bash
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

This should take for a little while, as encryption should be hard for computers.

## Create a configuration file for SSL

Now we need to create a new file on our server to hold the settings for NGINX's SSL. If we add another domain to this server, we will be able to reuse them this way.

```bash
sudo nano /etc/nginx/snippets/ssl-params.conf
```

Paste the following:

```bash
# See https://cipherli.st/ for details on this configuration
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_prefer_server_ciphers on;
ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
ssl_ecdh_curve secp384r1; # Requires nginx >= 1.1.0
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off; # Requires nginx >= 1.5.9
ssl_stapling on; # Requires nginx >= 1.3.7
ssl_stapling_verify on; # Requires nginx => 1.3.7
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;

# Add our strong Diffie-Hellman group
ssl_dhparam /etc/ssl/certs/dhparam.pem;
```

## Configure our domain to use SSL

At this point, we have our certificate, a strong Diffie-Hellman group, and a secure SSL configuration, now we just have to actually set up the reverse proxy.

Open the site configuration again:

```bash
sudo nano /etc/nginx/sites-enabled/default
```

And append the following lines to the end of the file:

```bash
# HTTPS — proxy all requests to the Node app
server {
    # Enable HTTP/2
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.example.com;

    # Use the Let’s Encrypt certificates
    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    # Include the SSL configuration from cipherli.st
    include snippets/ssl-params.conf;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://localhost:5000/;
        proxy_ssl_session_reuse off;
        proxy_set_header Host $http_host;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }
}
```

This configuration will listen for connections to our domain on port 443 (the HTTPS port), uses the certificate we generated to secure the connection, and then proxies our app's output to the browser. 

**WATCH OUT!** Don't forget to replace all the instances of `app.example.com` in the configuration details above with your domain name!

Let's now test the NGINX configuration with `sudo nginx -t`. If everything went well, we should get something like this:

```bash
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

And now, the very last step: start Nginx.

```bash
sudo systemctl start nginx
```

## 502 Bad gateway

When I visited my site first I got a 502 Bad gateway error message. The issue was that only Nginx was running, but not PM2. When I tried to run PM2 as well, it failed. Then I stopped Nginx and run PM2 and it worked. Then I tried to run Nginx but then it was the one failing.

I could not run Nginx and PM2 at the same time. After some thinking I realized that the issue was the both of them tried to run on port 80, so I changed to run the Node.js app on port 5000 instead. Then, it worked like a charm.

## The result

It might happen that instead of our Node.js application we get to see a "Welcome to nginx" screen. In that case, we just need to restart nginx with `sudo systemctl restart nginx` and refresh our browser to see our app.

And the result? Besides all the fun experienced we gained, we have deployed our Node.js application on our own, using a Process Manager to make sure it lives after we leave the Terminal session, and spins up when the system restarts, we are using a proxy server in the shape of Nginx, plus we have implemented SSL encryption. 

Big thumbs up for Jason Lengstorf for the tutorial, make sure to check out [his original writing](https://code.lengstorf.com/deploy-nodejs-ssl-digitalocean/).