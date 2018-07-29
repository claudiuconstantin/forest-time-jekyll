---
layout: post
title: Authentication in Node.js with Passport.js
date: 2017-07-17 09:11:29
---

This is a perfect example why I completely understand that people tend to be afraid of JavaScript world. So many modules, and many times, so poor documentations. Tutorials everywhere, doing the exact same complex thing. "Let's implement a fully functioning API with these simple steps." here, "How to build a simple authentication system with my favorite 85 packages" there. Oh, you got stuck? No problem, let's install a package for that. 

## Passport.js

Let's take [Passport.js](http://passportjs.org/docs) for example. In the documentations we can read through small snippets, about things that we **might** have to use. Optional flags, possibilites, but not a single step-by-step guide. Let's try to [google Passport.js tutorial](https://www.google.hu/search?client=opera&q=passport.js+tutorial&sourceid=opera&ie=UTF-8&oe=UTF-8), what do find there? Robust, complex tutorials with sessions, MongoDB, and with very-very custom setups, making us install tons of dependencies we might don't even need.

I understand that these articles are trying to focus on real-world usecases, but if we follow this impatient approach where we blindly follow the tutorial that is front of us and where we install a new component for every-single-problem, instead of truly understanding the tools we are using, then we are simply taking the irresponsible approach. And yes, our app will pay the price on the long-run (thus us, the developers).

## Really basic authentication

What I want whenever I start using something new is a Hello World, and then take it step by step. Wihtout any other tools. Without *sessions, models and MongoDB*. I want hard-coded values, no more than 80 lines of code. Let me present you that Hello World in Passport.js:

```ts
// server.ts
import * as passport from "passport";
import * as pl from "passport-local";
import * as bodyParser from "body-parser";

const LocalStrategy: any = pl.Strategy;

app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended:true }));

var expectedUser = {
    username: "jacob",
    password: "password"
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});

passport.use(new LocalStrategy((username: string, password: string, done: any) => {
        if (username === expectedUser.username && password === expectedUser.password) {
            return done(null, {username: "gabor", password: "password"});
        } else {
            return done(null, false, { message: "Incorrect credentials" });
        }
    }
));

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req: express.Request, res: express.Response) => {
    res.redirect('/test');
})
```

Easy to test, easy to understand: if we send a `POST` to `/login`, redirect to `/test` if the authentication succeeds, otherwise redirect to `/login`. That's all it does. Hard-coded, easy to follow, and yet, there are some gotchas which we really have to take care of, and if we don't discuss this small snippet of code because we are in a rush to connect it to our database, then we will be in a huge trouble when the next time our system crashes, and we will have no clue why, because we were busy implementing other 3 fantastic features, and we have absolutely no idea how Passport.js works.

## Things they don't tell you

1. **[bodyParser](https://www.npmjs.com/package/body-parser)** package is required for this module to work . Where is it documented? Well, nowhere. Surely, you can find it in one of the examples in the [official documentation](official documentation), but it is among 6 other packages which we actually don't need. Fortunately [Stackoverflow always helps](https://stackoverflow.com/questions/30604300/node-passport-local-strategy-always-fails).
2. This solution uses the [passport-local](https://github.com/jaredhanson/passport-local) package, which provides us the `LocalStrategy` strategy. This strategy is referenced by the `local` string which is being passed to `passport.authenticate('local')`. As we can read it in the [documentation of the package](https://github.com/jaredhanson/passport-local), this string is not optional! This is something we can completely overlook if we just follow the Passport.js documentation or any tutorials we googled.
3. The signiture of the `LocalStrategy` callback comes from a form, where the input fields have to have the `name='username'` and `name='password'` attributes. This was documented in most of the tutorials I read, but reading the code it is less than obvious.
4. In this example I did not want to deal with sessions. However, apparently passport does some session managment in the background; therefore we need to `serialize` and `deserialize`, no matter what ([see documentation under Sessions](http://passportjs.org/docs)).

This was the smallest working example I could put together, which I did not really find anywhere. Now you have it.

## One step further: sessions

Now that we can authenticate our users by validating the data they are sending with login forms, time to set up a session management system. We will use 3 packages for that, let's have a look at them, one-by-one:

### express-session

Why do we need sessions and what problems do they solve? This chapter called [Sessions in Express.js from the book Express Web Application Development](http://expressjs-book.com/index.html%3Fp=128.html) sums it up pretty well. Because HTTP is stateless, we need a way to store user data between HTTP requests in order to associate one request to another. There are basically two main ways to do that: we can use cookies however it might be not the best solution as this data will be exposed to the client and more importantly: it can be altered. Therefore another approach is preferred: keeping user data on the server side, and associate these data-sets with an ID. That ID is what is going to be kept on the client and be sent with each request. To handle and manage these data-sets we will use what is called a **Session store**.

Here is a simple page visit example:

```bash
npm install express-session @types/express-session --save
```

```ts
//server.ts
import * as session from "express-session";

app.use(session({
    secret: 'sshhhhhhhhh'
}));

app.get('/', (req, res) => {
    
    var sess = req.session;
    if (!sess.counter) {
        sess.counter = 0;
    }

    sess.counter++;

    res.render('home', { counter: sess.counter });
});
```

Express comes with a built-in store called the **MemoryStore** (this is what we are using by default in the example above), however it is strongly suggested not to use it other than only for test purposes, because of memory leaks and data loss. We can easily define another store which we are going to do. We are going to use [RedisStore](https://www.npmjs.com/package/connect-redis).


### RedisStore

First, we have to install [Redis](https://redis.io) on our computer of course. Then, we will install the [connect-redis](https://www.npmjs.com/package/connect-redis) package which is designed for session management.

```bash
npm install connect-redis @types/connect-redis --save
```

We need to pass the `session` object to the RedisStore object when initializing.

```ts
import * as session from "express-session";
import * as rs from "connect-redis";

const RedisStore: rs.RedisStore = rs(session);
const app: express.Express = express();

app.use(session({
    secret: "yo",
    store: new RedisStore({
        host: '127.0.0.1',
        port: 6379,
        prefix: 'sess'
    })
}));
```

Now our sessions work the same, but now we are using Redis to store session information instead of the built in MemoryStore. How do we know that it works? Easy, just change the the port from 6379 (which is the default port for Redis) to something else and we can see that it will break.

## Sessions with Passport.js

Now, let's connect our previous Passport setup with Redis session management. In the following setup we will be able to not only validate whether the provided credentials are right, but also establish a session which follows the user, ready to be validated anytime. 

```ts
import * as path from "path"; // Path string management - not relevant for this tut
import * as hbs from "express-handlebars"; // Templating engine - not relevant for this tut
import * as express from "express";
import * as passport from "passport";
import * as pl from "passport-local";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as rs from "connect-redis";

const port: number = 5000;
const client: redis.RedisClient = redis.createClient();
const LocalStrategy: any = pl.Strategy;
const app: express.Express = express();
const RedisStore: rs.RedisStore = rs(session);

app.use(session({
    secret: "yo",
    store: new RedisStore({
        host: '127.0.0.1',
        port: 6379,
        prefix: 'sess'
    })
}));

const LocalStrategy: any = pl.Strategy;
const RedisStore: rs.RedisStore = rs(session);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended:true }));

// Login validator middleware
let isLoggedIn = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Hardcoded user
var expectedUser = {
    username: "gabor",
    password: "password"
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});

// Local validator - username and password is received from the form from name="username" and name="password" inputs
// This strategy is referenced with the 'local' string
passport.use(new LocalStrategy((username: string, password: string, done: any) => {
        if (username === expectedUser.username && password === expectedUser.password) {
            return done(null, {username: "gabor", password: "password"});
        } else {
            return done(null, false, { message: "Incorrect credentials" });
        }
    }
));

// Calls the LocalStrategy authenticator middleware. Redirects to root if fails, redirects to /profile if succeeds
app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req: express.Request, res: express.Response) => {
    res.redirect('/profile');
});

// Settings up the Handlebars templating engine
app.engine('hbs', hbs({
    extname: 'hbs', 
    defaultLayout: 'main', 
    layoutsDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Home view - redirect to profile if user is logged in
// Increase a view counter on each visit
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/profile');
    }
    
    var sess = req.session;
    if (!sess.counter) {
        sess.counter = 0;
    }

    sess.counter++;

    res.render('home');
}

// Profile view - using the isLoggedin middleware which redirects to root if user is not loggged in
app.get('/profile', isLoggedIn, (req: express.Request, res: express.Response) => {
    res.render('profile', {
        user: {
            name: JSON.stringify(req.session.passport.user.username),
            session: JSON.stringify(req.session)
        }
    });
});

// Logout
app.get('/logout', isLoggedIn, (req: express.Request, res: express.Response) => {
    req.logout();
    res.redirect('/');
})

app.listen(port);
```

A couple of things to note here, which were not really explained either in the documentation or in the tutorials I have found:

- `isAuthenticated()` [comes from Passport.js](https://github.com/jaredhanson/passport/blob/a892b9dc54dce34b7170ad5d73d8ccfba87f4fcf/lib/passport/http/request.js#L74), even though it is not stated in the documentation.
- When we define our `LocalStrategy` we return a user object if the authentication succeeds. That object is what gets injected into our session, and that is what's being evaluated when we call `req.isAuthenticated()`. 
- To kill this user object in the session we can call `req.logout()`. There will be nothing to evaluate for `isAuthenticated()`, thus will return `false`.

There you have it. The nice thing about this approach is that we only need to evaluate the user credentials when the user logs in, and from then we only have to maintain his/her session, which can be filled up with any kind of data - which will never leave the server, as all we send to the client is a session ID. 