---
layout: post
title: Node.js Handlebars
date: 2017-07-15 09:11:29
---

In this short tutorial I am going to install and implement a simple templating engine called [Handlebars](http://handlebarsjs.com) and I am going to hook it up with Node.js, so we will be able to present our data in nicely formatted HTML documents. For this tutorial I have went throught RisingStack's [Node Hero tutorial (the PDF version)](https://blog.risingstack.com/node-hero-tutorial-getting-started-with-node-js/) and [Academind's video tutorial](https://www.youtube.com/watch?v=1srD3Mdvf50). 

First let's install [express-handlebars](https://github.com/ericf/express-handlebars), and its [types](https://www.npmjs.com/package/@types/express-handlebars), which is a version of Handlebars tailored specifically for the express framework. 

```bash
npm install express-handlebars @types/express-handlebars --save
```

Then, let's create the following folder structure:

```
/dist
/src
	/views
		/layouts
			main.hbs
		error.hbs
		home.hbs
	server.ts
```

In this setup, I am using TypeScript which gets compiled to the `dist` folder. We have to also make sure that `.hbs` files get copied to `dist` as well. For that, I have used the [copyfiles](https://www.npmjs.com/package/copyfiles) package...

```
npm install copyfiles --save-dev -g
```

... and added it to my `build` script in `package.json` file.

```json
 "build": "copyfiles -u 1 src/**/*.hbs dist && tsc",
```

Now that we have our files in place upon compilation, let's integrate Handlebars to our express application.

```ts
// inside server.ts
import * as hbs from "express-handlebars";
import * as path from "path";

app.engine('hbs', hbs({
    extname: 'hbs', 
    defaultLayout: 'main', 
    layoutsDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
```

With this configuration we have set the default layout which will be the basic wrapper for our HTML files, the path for our templates, and set handlebars to be our view engine. Now let's use this engine in a request:

```ts
// inside server.ts

app.get('/', (req, res) => {
    res.render('home', {
        name: "stranger",
        featureArray: [
            {feature: "Open-source", makesSense: true},
            {feature: "Feedback-system", makesSense: true},
            {feature: "Potato", makesSense: false},
            {feature: "Written in and with Node.js, TypeScript and other cool tools", makesSense: true},
            {feature: "I like trains", makesSense: false}
        ]
    });
});
```

With this in place we are going to render the view `home` which is going to wrapped in the `main` template. We are also going to pass a set of data to the view which we will loop through and present based on a condition.

Let's write our `main` wrapper. 

```html
{% raw %}
<html>
	<head>
		<title>Kudos</title>
		<link rel="stylesheet" href="https://bootswatch.com/yeti/bootstrap.min.css">
	</head>
	<body>
		{{{ body }}}
		<footer class="footer">
			<div class="container">
				<p class="text-muted">You can also visit the project on <a href="https://github.com/gaboratorium/kudos" target="_blank">GitHub</a>.</p>
			</div>
		</footer>
	</body>
</html> 
{% endraw %}
```

As you have probably guessed it, all the views are going to be injected in the `body` handlebar. The triple handlebars indicate that the data passed into it should not escape HTML. Finally, let's write our `home.hbs` as well.

```html
{% raw %}
<div class="container">
	<div class="page-header">
		<h1>Welcome {{ name }} to Kudos</h1>
	</div>
	<p class="lead">This is a Node.js application currently under development. <a href="https://gaboratorium.github.io" target="_blank">Visit my blog</a> to follow to follow up with the project's progress.</a></p>
	<h2>What is this?</h2>
	<p>Meanwhile the app is under development at the moment, here are some of the main key characteristics:</p>
	<ul>
		{{# each featureArray }}
			{{# if this.makesSense }}
				<li>{{ this.feature }}</li>
			{{/ if}}
		{{/ each}}
	</ul>
	{% endraw %}
</div>
```

One thing to note here, is that whenever we start a new handlebars code block, we have to indicate it with a hash (`#`), and close the tag with a slash (`/`) prefix. Now if we run our application (in my case compile TS, copy `.hbs` files running the `build` script), we should be able to visit the app in our browser and see our templates being used.
