---
layout: post
title: Continuous integration with Jenkins
date: 2017-06-24 09:11:29
---

In the following post I am going to set up a basic [CI](https://en.wikipedia.org/wiki/Continuous_integration) system using [Jenkins](https://jenkins.io/) to deploy a Node.js application into production. To to that, I am going to follow [this tutorial](https://codeforgeek.com/2016/04/continuous-integration-deployment-jenkins-node-js/) by Shahid Shaikh.

![Jenkins](https://www.kiuwan.com/wp-content/uploads/2015/02/jenkins.png)

> Most of the time testing and deployment steps do not change frequently and in order to keep the developer focus on writing code we do the automation of testing and deployment. This automation is called “continuous integration and deployment”.

![Continuous Integration](https://kaizentesting.files.wordpress.com/2012/08/continuousintegrationcycle.png)

## Flow of the system

1. We made some changes in our project
2. We push these changes to our GitHub repository's master branch
3. GitHub will notify Jenkins about the new push
4. Jenkins will then run the commands we ask it to run (which will be testing the script, deploying the script and maybe compiling it)

## Prerequisites

- a simple Node.js application with GitHub repo
- DigitalOcean droplet

Let's get started by creating a npm project on our local system by typing `npm install -y` (`-y` stands for accepting all default values). My simple application lives in a file called `server.js` and does the following:

```javascript
var http = require('http');

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World from Nodejs!');
    console.log("Listening on port 5000...");
}).listen(5000);
```

## Writing a simple test

Let's write our first simple test case. To do that, we are going to install `supertest`, `should` and `mocha`. Also, `mocha` will need to be installed globally as well.

```bash
# Install locally
npm install --save-dev supertest should mocha

# Install globally
npm install -g mocha
```

Now we create a folder in our project's root called `test` and we create a file inside it called `test.js`. Let's put the following simple test inside it:

```javascript
var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where the program is running.

var server = supertest.agent("http://localhost:4000");

// UNIT test begin

describe("SAMPLE unit test",function(){

  // #1 should return home page
  it("should return home page",function(done){
    // calling home page
    server
    .get("/")
    .expect("Content-type",/text/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      done();
    });
  });
});
```

Now let's try to run our Node app, open a new terminal session and run Mocha

```bash
# Run Node app. Use your own file name
node server.js

# Another terminal session: run Mocha
mocha
```

In the same terminal session we should see our test passing. Now we can push this change to our repository.

## Adding a GitHub webhook to push events to Jenkins

> When any changes i.e commits are pushed to Github repository, we need a mechanism to notify that event to our Jenkins Server which we going to configure in next section.

Open our GitHub repository and go to *Settings / Integrations & services*. Click on *Add services*, search `jenkins` and select *Jenkins GitHub Plugin*. We will be prompted to enter our password so do so.

Then, in the *Jenkins hook url* let's put our production address and append the `/github-webhook` suffix, this is what is going to get triggered. So, for example my hook url looks like this: `https://kudos.gaboratorium.com/github-webhook`.

## Installing Jenkins on our server

To install Jenkins on Ubuntu we can use the [official guide](https://pkg.jenkins.io/debian-stable/) and this [DigitalOcean tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-jenkins-on-ubuntu-16-04) for extra awesomeness.

First, let's add the key to our system:

```bash
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
```

Then we add the following entry in our `/etc/apt/sources.list`:


```bash
deb https://pkg.jenkins.io/debian-stable binary/
```

We update our local package index, and then finally install Jenkins:

```bash
sudo apt-get update
sudo apt-get install jenkins
```

To check if everything went well we can check the status of Jenkins:

```
sudo systemctl status jenkins
```

If everything went well, the beginning of the output should show that the service is active and configuret to start at boot.

```bash
jenkins.service - LSB: Start Jenkins at boot time
   Loaded: loaded (/etc/init.d/jenkins; bad; vendor preset: enabled)
   Active: active (exited) since Sat 2017-06-24 18:35:58 UTC; 48s ago
     Docs: man:systemd-sysv-generator(8)
```

By default, Jenkins runs on port 8080, so we have to enable that port in our Firewall.

```bash
sudo ufw allow 8080
```

To check the status of the Firewall:

```bash
sudo ufw status
```

Now, at this point I already had an Nginx proxy server set up, so I had to configure Nginx to serve Jenkins (which runs on port `8080`) over `https` as well. To do so, [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-configure-jenkins-with-ssl-using-an-nginx-reverse-proxy) by Melissa Anderson and [this one](https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-with-ssl-as-a-reverse-proxy-for-jenkins) by josh.reichardt will come handy.

Let's open our Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/default
```

First, we are going to add specific access and error logs in the `server` block with the SSL config settings:

```bash
# HTTPS — proxy all requests to the Node app
server {
    # Enable HTTP/2
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name kudos.gaboratorium.com;

    # Access and error log for Jenkins
    access_log /var/log/nginx/jenkins.access.log;
    error_log /var/log/nginx/jenkins.error.log;

    ...

```

Now we are going to add the actual proxy settings. I want to access Jenkins from a folder (like `https://kudos.gaboratorium.com/jenkins), so I will add the following location to the Nginx config fil (as it is shown in this [Jenkins Wiki](https://wiki.jenkins.io/display/JENKINS/Jenkins+behind+an+NGinX+reverse+proxy))

```bash
  location /jenkins/ {
    proxy_pass http://10.0.0.100:8080/jenkins/;
    proxy_redirect http:// https://;
    proxy_set_header   Host             $host:$server_port;
    proxy_set_header   X-Real-IP        $remote_addr;
    proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    proxy_max_temp_file_size 0;
    sendfile off;
    client_max_body_size       10m;
    client_body_buffer_size    128k;
    proxy_connect_timeout      90;
    proxy_send_timeout         90;
    proxy_read_timeout         90;
    proxy_buffer_size          4k;
    proxy_buffers              4 32k;
    proxy_busy_buffers_size    64k;
    proxy_temp_file_write_size 64k;
    proxy_http_version 1.1;
    proxy_request_buffering off;

  }
```

Now we will also have to configure Jenkins to listen for requests coming to the `/jenkins/` folder (like `http://10.0.0.100:8080/jenkins/` instead of `http://10.0.0.100:8080/`). We will open the Jenkisn default start-up configuration file and add the `prefix=/jenkins` flag. The configuration file can be found in `/etc/default/jenkins`. Look for the `JENKINS_ART` parameter list (somewhere in the bottom) and add the flag above.

```bash
JENKINS_ARGS="--webroot=/var/cache/jenkins/war --httpPort=$HTTP_PORT --ajp13Port=$AJP_PORT --prefix=/jenkins"
```

Exit and save the file. Then restart Jenkins and Nginx.

```bash
sudo service jenkins restart

sudo systemctl restart nginx
```
If everything went ok, we should be able to open Jenkins on our site (Mine is at `https://kudos.gaboratorium.com`). We will see a *Getting started* page which asks us to provide a password which has been written into a file at `/var/lib/jenkins/secrets/initialAdminPassword`. Let's open that file and copy the password. After doing that, we will be asked if we want to install some helpful plugins, let's select that. After everything has been installed, we can press *Save and Finnish*. At this point I didn't get redirected so I refreshed the page and pressed *Continue as admin*. Apparently, I skipped setting up an administrator user, so in the future I will have to log in with the username *admin* using the password which was required preiously.

We have succesfully Installed and configured Jenkins on our server.

## Connecting Jenkins to GitHub

Click on **Manage Jenkins**, then  click on **Manage Plugins**. Because I have preinstalled some plugins when I installed Jenkins, I already had the GitHub plugin. Let's go back to the Jenkins homepage and click on **New item**. Give our item the project's name and choose **Freestyle project**. Click **Ok**, and we will get redirected to the item configuration screen. Check **GitHub project** and provide the GitHub project link (like `https://github.com/gaboratorium/kudos`). Under **Source Code Management** select **Git** and add the repository URL (with **.git** extension).

Under **Build Triggers** section select **GitHub hook trigger for GITScm polling** (previously called "Build when a change is pushed to GitHub"). Under *Build* section click on **Add build step** and select **Execute shell** option. For now, let's just write the **npm install** command.

Now that we have Jenkins in place, we can check our webhook URL if we go to **Manage Jenkins > GitHub** and then we press the little blue question mark. Update the webhook URL in our GitHub repository settings if necessary. 

## Testing

We can test our system by making some changes in our project and pushing it to GitHub. We should see the building process logged in Jenkins as well. I have experienced occasional breaks which resulted in 502 errors, but simply restarting Jenkins (`sudo service jenkins restart`) fixed the problem.

## Configuring the deployment process

Now we have GitHub communicating to Jenkins, so it is time to deploy our solution to our server. Jenkins will execute a set of commands:

- Login to server using SSH
- Switching to project directory
- Pulling code from GitHub
- Build solution
- Restarting process manager (PM2 for example)

We will write down all of these commands in one file and tell Jenkins to execute them in sequence.

## If Jenkins is on a different server

These steps are only required if our producation application and our Jenkins are on different servers.

We are going to generate an SSH key manually from Jenkins server and we will add it into our Development server.

Let's log in to our server and switch to the jenkisn user which has been automatically created when Jenkins was installed.

```bash
su jenkins
```

Let's generate the RSA key:

```bash
ssh-keygen -t rsa
```

Press Enter for the location and do not provide any passwords, just keep pressing Enter. Once the process is completed, print the public key information to the screen:

```bash
cat ~/.ssh/id_rsa.pub
```

The key should start with `ssh-rsa` and end with `jenkins@your-droplet-ip`. Copy this key. Now let's login to our development server (could be the same server of course), change to `root` and navigate to the `~/.ssh` directory, or create it if it does not exist.

```bash
su root
cd ~/.ssh
# or
mkdir ~/.ssh
```

Open or create the file called `authorized_keys`.

```bash
nano authorized_keys
```

Append the key in the file, if there is already some information present, just append the key in the new line. Exit and save the file.

## Deployment script

Let's create a new file in our project directory without extension, called `deploy`, and paste the following:

```bash
-#!/bin/sh
# Connect to server (if Jenkins and Production are not the same)
# ssh userName@development-server-ip <<EOF
cd /your-project-path
git pull
npm install --production
pm2 restart all
exit
EOF
```

Save the file. Make it executable with the following:

```bash
chmod +x deploy
```

Go to Jenkins project page, go to **Configure** and scroll down to the **Build section**. Add the `./deploy` command to the build commands. Click save.

## Failing builds

### Permissions for Jenkins

Unfortunately, I had several issues with this setup. The first was, that Jenkins could not open and run the `deploy` file due to insufficient permissions. I solved this by copying these commands right into Jenkins in **Configure > Build > Execute shell command**. Then I added `jenkins` users to the sudorers group.

```bash
# Open /etc/sudoers
visudo
```

I appended the following: 

```bash
jenkins ALL = NOPASSWD: ALL
```

Then, Jenkins was able to fetch from git, create folders, or run the TypeScript compiler.

## 502 Bad Gateway and "Cannot allocate memory"

I had two issues at this point: first, Nginx kept giving me 502 server error occasionally, which could be only fixed be restarting Jenkins. The next one was that the builds kept failing, and I always got the following error:

```bash
Started by GitHub push by gaboratorium
Building in workspace /var/lib/jenkins/workspace/kudos.gaboratorium.com
 > git rev-parse --is-inside-work-tree # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url https://github.com/gaboratorium/kudos.git # timeout=10
Fetching upstream changes from https://github.com/gaboratorium/kudos.git
 > git --version # timeout=10
 > git fetch --tags --progress https://github.com/gaboratorium/kudos.git +refs/heads/*:refs/remotes/origin/*
ERROR: Error fetching remote repo 'origin'
hudson.plugins.git.GitException: Failed to fetch from https://github.com/gaboratorium/kudos.git
	at hudson.plugins.git.GitSCM.fetchFrom(GitSCM.java:812)
	at hudson.plugins.git.GitSCM.retrieveChanges(GitSCM.java:1079)
	at hudson.plugins.git.GitSCM.checkout(GitSCM.java:1110)
	at hudson.scm.SCM.checkout(SCM.java:495)
	at hudson.model.AbstractProject.checkout(AbstractProject.java:1276)
	at hudson.model.AbstractBuild$AbstractBuildExecution.defaultCheckout(AbstractBuild.java:560)
	at jenkins.scm.SCMCheckoutStrategy.checkout(SCMCheckoutStrategy.java:86)
	at hudson.model.AbstractBuild$AbstractBuildExecution.run(AbstractBuild.java:485)
	at hudson.model.Run.execute(Run.java:1735)
	at hudson.model.FreeStyleBuild.run(FreeStyleBuild.java:43)
	at hudson.model.ResourceController.execute(ResourceController.java:97)
	at hudson.model.Executor.run(Executor.java:405)
Caused by: hudson.plugins.git.GitException: Command "git fetch --tags --progress https://github.com/gaboratorium/kudos.git +refs/heads/*:refs/remotes/origin/*" returned status code 128:
stdout: 
stderr: error: cannot fork() for fetch-pack: Cannot allocate memory

	at org.jenkinsci.plugins.gitclient.CliGitAPIImpl.launchCommandIn(CliGitAPIImpl.java:1903)
	at org.jenkinsci.plugins.gitclient.CliGitAPIImpl.launchCommandWithCredentials(CliGitAPIImpl.java:1622)
	at org.jenkinsci.plugins.gitclient.CliGitAPIImpl.access$300(CliGitAPIImpl.java:71)
	at org.jenkinsci.plugins.gitclient.CliGitAPIImpl$1.execute(CliGitAPIImpl.java:348)
	at hudson.plugins.git.GitSCM.fetchFrom(GitSCM.java:810)
	... 11 more
ERROR: Error fetching remote repo 'origin'
Finished: FAILURE
```

After some research it turned out that this is a typical OOM error meaning that my server simply ran out memory and therefore could not run Nginx and Jenkins properly. However creating some swap space solved the issue. To do that I have followed [this guide on DigitalOcean written by Justin Ellingwood](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04).

## How to add swap space on Ubuntu 16.04

> Swap is an area on a hard drive that has been designated as a place where the operating system can temporarily store data that it can no longer hold in RAM. Basically, this gives you the ability to increase the amount of information that your server can keep in its working "memory", with some caveats. The swap space on the hard drive will be used mainly when there is no longer sufficient space in RAM to hold in-use application data.

### Check Check the system for swap information

1. Check the system for swap information: `sudo swapon --show`. If we don't get any output, it means we don't have swap space available currently.
2. Double check it with `free -h`.
3. Check available space on hard drive partition `df -h`. 

> Although there are many opinions about the appropriate size of a swap space, it really depends on your personal preferences and your application requirements. Generally, an amount equal to or double the amount of RAM on your system is a good starting point. Another good rule of thumb is that anything over 4G of swap is probably unnecessary if you are just using it as a RAM fallback.

### Create a swap file

1. Let's create a 4 gigabyte `swapfile` in our root (`/`) directory: `sudo fallocate -l 4g /swapfile`.
2. Verify that the correct amount of space was verified: `ls -lh /swapfile`.
3. Now, the file is created but the system does not know that it is supposed to used for swap. We need to tell our system to format this file as swap and enable it.
4. But before that, let's adjust the permissions, so that the file is not readable by anyone besides root: `sudo chmod 600 /swapfile`.
5. Verify that the file has the correct permissions: `ls -lh /swapfile`. We should get: `-rw------- 1 root root 4.0G Apr 28 17:19 /swapfile`.
6. We can tell our system to set up the swap space: `sudo mkswap /swapfile`.
7. Our file is now ready to be used as swap space. Let's enable this: `sudo swapon /swapfile`.
8. Verify that the procedure was succesful by checking the swap space now: `sudo swapon -s`.
9. Verify it with the `free` utility again: `free -m`.

### Make swap file permanent

1. Our swap file is enabled, but when the server reboots, the file will not be automatically enabled. We can change that by modifying the `fstab` file: `sudo nano /etc/fstab`.
2. At the bottom of the file, you need to add a line that will tell the operating system to automatically use the file you created: `/swapfile   none    swap    sw    0   0`.
3. Save and close the file.

### Tweak swap settings

> The `swappiness` parameter configures how often your system swaps data out of RAM to the swap space. This is a value between 0 and 100 that represents a percentage.

1. Check current swappiness: `cat /proc/sys/vm/swappiness`. By default it was `60` for me.
2. If we want, we can change that: `sudo sysctl vm.swappiness=10`.
3. This setting will only persist until the next reboot. We can set this value automatically at system restart by adding a line to our `/etc/sysctl.conf` file: `sudo nano /etc/sysctl.conf`.
4. At the bottom, add the following line: `vm.swappiness=10`.
5. Save and close.

> Another related value that you might want to modify is the vfs_cache_pressure. This setting configures how much the system will choose to cache inode and dentry information over other data.

1. See current value: `cat /proc/sys/vm/vfs_cache_pressure`.
2. `100` removes inodes information from the cache too quicly. We can set this to a more conservative setting like 50: `sudo sysctl vm.vfs_cache_pressure=50`.
3. Again, this is only valid for current session. Let's make it permanent: `sudo nano /etc/sysctl.conf`.
4. At the bottom add the following line: `vm.vfs_cache_pressure = 50`.

## Conclusion

With this setup I have managed to hook up Jenkins with GitHub, make Jenkins log in to my server and execute operations on it. Upon changes on the `master` branch, it fetches the latest version from GitHub, and builds the solution, resulting in a smooth continous integration system. 