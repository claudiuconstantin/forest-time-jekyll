---
layout: post
title:  "GitHub Pages with a custom domain over HTTPS"
date:   2018-07-23 10:23:16 +0200
categories: security
published: false
---

**In this tutorial I am going to show you how you can add your custom domain to your GitHub Pages site and serve it over HTTPS using Cloudflare.**

By the end of the tutorial you will have your site published at your chosen domain or subdomain and served over HTTPS.

## Prerequsities

- A purchased domain
- A blog published on [GitHub Pages](https://pages.github.com)

## The setup

Cloudflare is a service offering Content Delivery and DNS services. By using Cloudflare we can easily set up SSL encrypted communication from and to our website for free.

We are going to set our domain's nameservers to point to Cloudflare's nameservers and then Cloudflare will serve our blog from GitHub Pages using CNAME records that we are going to add. 

### Terminology 

This is a great opportunity to learn a bit about the HTTPS and DNS related terminology, so let's have a quick look at them:

- [HTTPS (Hypertext Transfer Protocol Secure)](https://en.wikipedia.org/wiki/HTTPS): secured HTTP communication. Encrypted using TLS or SSL.
- [SSL (Secure Sockets Layer)](https://en.wikipedia.org/wiki/Transport_Layer_Security): cryptographic protocol that uses symmetric encryption. In short it works the following way: when the client wants to communicate with the server a standard SSL handshake takes place, in which the server has to provide an SSL certificate that has been issued by a certificate authority. A list of certificate authorities is present in the most commonly used operating systems, this way the client can check whether the certificate provided by the server has been issued by a trusted provider or not. If the handshake was successful, the following communication will be end-to-end encrypted.
- [DNS (Domain Name System)](https://en.wikipedia.org/wiki/Domain_Name_System): naming system for resources connected to the Internet, in which we map IP addresses to memorable domain names (e.g.: example.com). The central database of Internet domain names and IP addresses is maintained by an American-based company called Network Solutions.
- [DNS Record](https://en.wikipedia.org/wiki/List_of_DNS_record_types#SOA): DNS records are stored on a DNS name server. A commonly used metaphor for DNS name servers are telephone directories, in which a person (a domain name) is mapped to a phone number (an IP address). In such directories sometimes some kind of service, for example a plumber (a domain name) is not mapped to a phone number but to person (another domain name) that is mapped to a phone number (an IP address). These mappings are called DNS records and they have various types.
- [A record](): Points to an IPv4 address (e.g.: *172.16.254.1*).
- [AAAA record](): Points to an IPv6 address (e.g.: *2001:db8:0:1234:0:567:8:1*).
- [CNAME record](): Alias for another domain name (e.g.: *example.com*).

### 1. Set up our GitHub repository

First, we have to set up our GitHub repository. Let's go to the **Settings** page of our repo, and let's set our **Custom domain** to the address at which we want o publish our site.

### 2. Add DNS records to your domain registrar

Let's [create a Cloudflare account](https://dash.cloudflare.com/sign-up). After registration we'll have to add our purchased domain address (example.com) to our account. Once our site has been created let's navigate to the DNS section of our site. There we will find the Cloudflare Nameservers, which we are going to use to point our DNS servers at.

```bash
# Example Cloudflare Nameservers
something.ns.cloudflare.com
something-else.ns.cloudflare.com
```

Now let's go over our domain registrar's control panel which might be AWS Route 53, GoDaddy or something similar. Let's add the Cloudflare Nameservers to our domain. 

Depending on whether you want to publish your site on a given subdomain (e.g.: blog.example.com) or on the main domain (e.g.: example.com) you have to either add new NS records for your subdomain or simply edit the current one.

For the name of the new NS records enter your selected subdomain (e.g.: *blog.example.com*), for the type select NS (Name server), and for the value enter your Cloudflare name server addresses. Now our selected domain or subdomain will continue to resolve on the Cloudflare DNS server.

If you are using Route 53 don't forget to also add the name servers under **Domains > Registered Domains > *example.com* > Add or edit name servers**. 

### 3. Add DNS records to Cloudflare

Now let's head to our Cloudflare account's DNS section. Let's create a new CNAME record with the name of your selected domain — if your blog is going to be published at *blog.example.com*, then the name has to be set to `blog`. If you want to publish your site on your main domain then you have to provide the main domain (e.g.: `example.com`).

For the Domain name insert your GitHub Pages site URL (e.g.: *example.github.io*). Press **Add Record**. We want to serve our site over HTTPS so let's go the **Crypto** section of our account and make sure that the **SSL** setting is set to Full.

We have one thing left to do: let's create a file called `CNAME` in the root directory of our GitHub repository and add the domain name in it, at which the site resolves.

```bash
# Example CNAME
blog.example.com
```

### Caching

One last thing to keep in mind: Cloudflare automatically caches the contents of your website. Due to this, you might not see the changes you make to your site immediately, therefore make sure to check out the **Caching** section of your Cloudflare site, where you can purge chached files on demand and also set the caching level.