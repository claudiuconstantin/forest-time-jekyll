---
layout: post
title: Redis setup with Node.js
date: 2017-07-15 09:11:29
---

In this tutorial I am going to set up a Redis server and connect it to a Node.js application. I have watched [this (Redis Crash Course Tutorial)](https://www.youtube.com/watch?v=Hbt56gFj998) and [this (Build A Node.js & Redis App From Scratch)](https://www.youtube.com/watch?v=9S-mphgE5fA&t=349s) tutorials by Traversy Media which I highly recommend.

![Redis](https://datadog-prod.imgix.net/img/blog/how-to-monitor-redis-performance-metrics/redis-blog-1.png?ch=Width&fit=max&fm=png&auto=format&lossless=1)

## Set up locally

First, we have to download and install Redis server. We can download the linux version from the [official downloads page](https://redis.io/download), or we can get the Windows version from the [MicrosoftArchive GitHub page](https://github.com/MicrosoftArchive/redis).

By default, Redis is installed to `C:\Program Files\Redis`. We can run `redis-cli.exe` to start playing around and getting to know Redis.

Now let's install the [Redis client for Node.js](https://github.com/NodeRedis/node_redis) and its type definitions in our project.

```bash
npm install redis @types/redis --save
```

Once `redis_node` is in place, let's launch it in our `server.ts` file. I also created a proof of concept endpoint which will returned a hard-coded json result for now.

```ts
import * as redis from "redis";
import * as express from "express";

const port: number = 5000;
const client: redis.RedisClient = redis.createClient();
const app: express.Express = express();

client.on("error", (err) => { console.log("Error " + err); });
client.on('connect', () => { console.log("Redis connected."); })

app.get('/', (req, res) => {
    res.send("Hello World from Nodejs! Compiled with TS, deployed by Jenkins, tested by Mocha (unit + functional), watched by nodemon");
})

app.get('/users', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({name: "Han Solo", job: "smuggler"});
})

module.exports = app;

let isCalledDirectly: boolean = !module.parent;
if (isCalledDirectly) {
    console.log("Server listening on port:" + port);
    app.listen(port);
}

```

If everything went well, running our app will output the `Redis connected` message. When we hit the `localhost:5000/users` we should get our `Han Solo` object. Let's involve `Redis` by inserting some data on server start which we are going to query when we hit our endpoint.

```ts
import * as redis from "redis";
import * as express from "express";

const port: number = 5000;
const client: redis.RedisClient = redis.createClient();
const app: express.Express = express();

client.on("error", (err) => { console.log("Error " + err); });
client.on('connect', () => { console.log("Redis connected."); })
client.flushall();

client.hmset("users:han", "name", "Han Solo", "job", "smuggler");
client.hmset("users:chewie", "name", "Chewbacca", "job", "smuggler");

client.lpush("users", "users:han");
client.lpush("users", "users:chewie");

app.get('/', (req, res) => {
    res.send("Hello World from Nodejs! Compiled with TS, deployed by Jenkins, tested by Mocha (unit + functional), watched by nodemon. You can send a GET request to `/users`.");
})

app.get('/users', (req, res) => {

    client.lrange("users", 0, -1, (error, userNames) => {
        if (error) { res.status(500).send("Oops something went wrong!");  }

        var i: number = 0;
        var users: Array<any> = [];
                
        userNames.forEach(userName => {
            client.hgetall(userName, (error, userObj) => {
                if (error) { res.status(500).send("Oops something went wrong!");  }
                users.push(userObj);
                
                i++;
                if (i == userNames.length) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(users);
                } 
            });
        });
    });
})

module.exports = app;

let isCalledDirectly: boolean = !module.parent;
if (isCalledDirectly) {
    console.log("Server listening on port:" + port);
    app.listen(port);
}
```

Because Redis cannot store nested objects, my best take on this was to maintain a separate list containing the usernames. Read more about this problem in this article titled [Storing nested objects in Redis](https://alexandergugel.svbtle.com/storing-relational-data-in-redis) by Alexander Gugel. Now that we are over the easy part, let's install Redis on our production server as well.    

## Set up Redis on Ubuntu

First, let's [install Redis on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04). In order to do that, we have to first install some build dependencies.

```bash
sudo apt-get update
sudo apt-get install build-essential tcl
```

Now we can install the source code of Redis and unpack it.

```bash
cd /tmp
curl -O http://download.redis.io/redis-stable.tar.gz
tar xzvf redis-stable.tar.gz
cd redis-stable
```

Let's compile the Redis binaries.

```bash
make
```

This will take a couple of seconds. As the hint will show at the end, it's a good idea to run the test suite to make sure that everything was built correctly.

```bash
make test
```

Once it's done, we can install the binaries onto the system.

```bash
sudo make install
```

Let's create a configuration directory. We will use the conventional `/etc/redis` directory.

```bash
sudo mkdir /etc/redis
```

Now, copy the sample Redis config file included in the Redis source archive.

```bash
sudo cp /tmp/redis-stable/redis.conf /etc/redis
```

### Configure Redis

Next, open the file to adjust a few items in the configuration.

```bash
sudo nano/etc/redis/redis.conf
```

> In the file, find the `supervised` directive. Currently, this is set to no. Since we are running an operating system that uses the systemd init system, we can change this to `systemd`:

```bash
// /etc/redis/redis.conf
supervised systemd
```

Now, we will specify the directory that Redis will use to dump persistent data. We will need a location that Redis will have write permission and that is not viewable by normal users.

```bash
// /etc/redis/redis.conf
dir /var/lib/redis
```

Save and close the file.

### Create a Redis systemd unit file

We are going to create a systemd unit file, so that the init system can manage the Redis process.

Create and open the `/etc/systemd/system/redis.service` file.

```bash
sudo nano /etc/systemd/system/redis.service
```

Inside the file copy the following:

```bash
[Unit]
Description=Redis In-Memory Data Store
After=network.target

[Service]
User=redis
Group=redis
ExecStart=/usr/local/bin/redis-server /etc/redis/redis.conf
ExecStop=/usr/local/bin/redis-cli shutdown
Restart=always

[Install]
WantedBy=multi-user.target
```

For further explanation please visit the [original tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04).

### Create the Redis user, group and directories

Now we are going to create the user, group and directories which we have referenced in the previous configuration files. Let's start by creating the `redis` user and group:

```bash
sudo adduser --system --group --no-create-home redis
```

Now, we create the `/var/lib/redis` directory:

```bash
sudo mkdir /var/lib/redis
```

Let's give the `redis` user and group the ownership of this directory:

```bash
sudo chown redis:redis /var/lib/redis
```

Now we adjust the permissions so that regular users cannot access this location:

```bash
sudo chmod 770 /var/lib/redis
```

### Start and test Redis

We can start up the systemd service by typing:

```bash
sudo systemctl start redis
```

We can also check that the service had no errors by doing:

```bash
sudo systemctl status redis
```

If we can see the `active (running)` status message we should be good to go. Now let's test the Redis instance by running the command line interface:

```bash
redis-cli
```

Let's test connectivity:


```bash
127.0.0.1:6379> ping
# Output: PONG
```

We can also set some keys and retrieve them by typing:

```bash
set test "It's working!"
get test
# Output: "It's working!"
```

For the last test let's exit Redis, restart it and retrieve the keys we have set previously again.

```bash
exit
restart redis
redis-cli
get test
# Output: "It's working!"
```

If all our tests worked, and we would like to start Redis automatically when our server boots, we can enable the systemd service.

```
sudo systemctl enable redis
```

Now we should have a Redis instance installed and configured on our Ubuntu server. 

To my biggest suprise, my Node.js application connected immidiately to Redis on the production server as well, no further configuration was needed. 