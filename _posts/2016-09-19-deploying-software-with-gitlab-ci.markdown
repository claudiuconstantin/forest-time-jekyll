---
layout: post
title: "Deploying software with GitLab CI"
date: 2016-09-19 14:10:19
---
I am working currently on setting up an automated deployment. Since my current project's repo is located on [GitLab](https://gitlab.com/), I decided to go with [GitLab Continous Integration](https://about.gitlab.com/gitlab-ci/).

GitLab CI is integrated with GitLab and promises an easy-to-learn, multi-platform, multi-language way to test, build and deploy our code.

## What we need

  - Nothing more than a GitLab project

## What we will do

  1. Set up continous integration with creating a config file called `.gitlab-ci.yml`
  2. Configure GitLab project to use a **Runner**

In result every push to our git repository will trigger the Runner to automatically start the pipeline (the predefined jobs in our `.gitlab-ci.yml` file), and which will output the result in our GitLab project's pipelines page.

## Steps

This tutorial shows briefly the procedure step by step: [Quick start](https://docs.gitlab.com/ce/ci/quick_start/README.html)

Our first step is to write our `.gitlab-ci.yml` file. This tutorial describes in detail how to do that: [https://gitlab.com/help/ci/yaml/README.md#environment](https://gitlab.com/help/ci/yaml/README.md#environment).

Noteworthy thing: **Docker** is integrated with GitLab CI, meaning that our Runner can use the [Docker Engine](https://www.docker.com/) to test and build our application by defining Docker Images. You can read more about Docker integration here: [Docker integration](https://gitlab.com/help/ci/docker/README.md)

**Runners** run our yaml. We can create our own specific Runner, or we can used a Shared one. 2 Shared runners are available and set on GitLab projects by default. Read more about Runners: [https://gitlab.com/help/ci/runners/README.md](https://gitlab.com/help/ci/runners/README.md)

**Environments** defined in our yaml will define where our code will get deployed. 

If we want to deploy from our internal repo to a remote, external server we will need to use SSH keys [Using SSH keys](https://docs.gitlab.com/ce/ci/ssh_keys/README.html).

In addition I recommend this webcast to watch: [Webcast Getting started with CI in GitLab (bad video quality)](https://www.youtube.com/watch?v=Hs8LCilGVaM).

## Auto-deployment with GitLab CI checklist

  - [ ] Create a Yaml file without any specific script, push it, check GitLab Piplines if it gets processed (Pending, Failed, Succesful) - by default GitLab will use its shared Runners
  - [ ] Create your custom Runner if necessary, check if your Yaml gets processed with that Runner
  - [ ] Set up an environment on GitLab Pipelines > Environments, define it in Yaml
  - [ ] Check if code gets deployed
  - [ ] Create your Build and Test scripts, don't forget to use the right Docker Images