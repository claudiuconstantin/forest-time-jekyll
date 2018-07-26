---
layout: post
title:  "Building static websites on AWS"
date:   2018-07-23 10:23:16 +0200
categories: aws
published: false
---

**In this tutorial I am going to show you how you can host a static website on an AWS S3 bucket and serve it over HTTPS using AWS CloudFront.**

By the end of the tutorial you will have your site published at your custom main domain (e.g.: example.com) that is going to be served from an S3 bucket.

## Prerequsities

- A custom domain
- A free-tier AWS account

### Potential fees

In this tutorial we are going to use **AWS S3** and **AWS CloudFront** — Amazon's Cloud Storage and Content Delivery Network services. Both of them are paid services, however unless you are expecting heavy traffic you will remain in the free-tier zone. Make sure that you are aware of these potential fees. For further information on CloudFront and S3 pricing please visit the official [CloudFront Pricing](https://aws.amazon.com/cloudfront/pricing/) and [S3 Pricing](https://aws.amazon.com/s3/pricing/) pages.

## The setup

We are are going to host our static HTML website in a S3 bucket. S3 buckets can be set up for static website hosting, however these sites will be served over HTTP by default, so to add HTTPS we'll use CloudFront. In CloudFront we are going to create a new CDN distribution that is going to serve our S3 hosted website using a certificate that we'll create in **AWS Certificate Manager**.

### 1. Creating an S3 bucket

Let's head over to Amazon S3 and hit the **Create bucket** button. There is one thing we have to consider when we choose our bucket name. [It is possible to serve the content of a bucket over HTTP](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/RoutingToS3Bucket.html) on a custom domain if our domain is registered at **AWS Route 53** by simply setting up an alias in Route 53 pointing to the given bucket **if the domain name and the bucket name match**. This tutorial is not going to use this solution, but you might want to have a look at this setup as well.

Since we would like to use HTTPS, we have to create a CloudFront distribution instead. Therefore having the bucket name and our domain name matching is not a requirement.

We can keep the default configuration settings except one setting: under **Configure options** let's set the **Manage public permissions** to **Grant public read access to this bucket**. This way everyone on the Internet will be able to read and see the website we store in this bucket. Hit **Next**, and then hit **Create bucket**.

Now we are ready to upload our website. Let's create the following HTML documents and upload them to our bucket.

```html
<!-- index.html -->
<h1>Hello, welcome to my site!</h1>
```

```html
<!-- error.html -->
<h1>Oops, something went wrong!</h1>
```

Now we have to set up this bucket for static website hosting. Click on the bucket itself, then go to **Properties** and click **Static website hosting**. Make sure that **Use this bucket to host a website** option is selected and that the Index and Error documents are provided. Hit **Save**. 

Now we can try to go to the endpoint provided by S3 which looks something like this:

```
 http://our-bucket-name.s3-website.our-region.amazonaws.com
```

If everything went well we should see our website being up and running.

### 2. Creating a CloudFront distribution

To serve our static website over HTTPS, we have to create a CloudFront distribution. Let's go to AWS CloudFront Dashboard and hit **Create Distribution** and then Choose **Web**. For the **Origin Domain Name** choose your newly created bucket. Set the Viewer Protocol Policy to **Redirect HTTP to HTTPS**. 

Under **Distribution Settings** set the **SSL Certificate** setting to **Custom SSL Certificate (example.com)**. Here you can click the **Request or Import a Certificate with ACM** button which will redirect you to the AWS Certificate Manager service. Here we will create a new SSL certificate for our main domain. 

Fortunately, setting up the certificate in AWS is pretty straightforward. For the domain name enter your domain name, then hit next. In order to issue a certificate AWS has to validate your ownership over the given domain: this can be done via e-mail or DNS verification. DNS verification works the following way: you declare a domain, then AWS issues a DNS CNAME record with a token that you have to set up in your DNS database in your Domain Registrar's (Route 53, GoDaddy etc.) control panel. This way AWS can verify your ownership. For more information please visit the [official documentation](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html).

If your domain has been registered in Route 53 AWS will provide you a **Create record in Route 53** button that will automatically set up this record for you. If your domain has been registered somewhere else then you'll have to do it manually.

Once your certificate has been successfully issued, you can continue creating your CloudFront distribution. The final step is to make sure that for the **Default Root Object** we set **index.html**. Finish the process by clicking **Create Distribution**.

### 3. Creating DNS records for our distribution

The very last step is to create the DNS records for the distribution we just created. In our domain registrar's control panel let's create a CNAME record:

```
# Name        / Type  / Value
# example.com / CNAME / 12345678.cloudfront.net
```

If our domain is registered at Route 53 we might want to create an A-Alias record instead which is generally a good practice. To do so, select an A type record and check the Alias checkbox. This way the reference will be made through an AWS Resource ID instead of an IPv4 — the advantage of this is that some of the resource's properties will be inherited by the record, such as its TTL or IP address, and their changes will be tracked and followed. For further information on this have a look at [this documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html).