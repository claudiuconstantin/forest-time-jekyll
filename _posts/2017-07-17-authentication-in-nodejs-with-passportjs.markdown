---
layout: post
title: Authentication in Node.js with Passport.js
date: 2017-07-17 09:11:29
published: false
---

Let's implement a simple authentication in Node.js using [Passport.js](http://passportjs.org).

Let's install a couple of dependencies:

```bash
npm install express-session @types/express-session passport @types/passport connect-redis @types/connect-redis passport-local @types/passport-local --save
```

What is what?


```ts
import * as passport from "passport";
import * as session from "express-session";
import * as rs from "connect-redis";


app.use(session({
    store: new RedisStore({
        url: "http://127.0.0.1:6379"
    }),
    secret: "veryRandomSecretYo123456",
    resave: false,
    saveUninitialized: false
}));
```