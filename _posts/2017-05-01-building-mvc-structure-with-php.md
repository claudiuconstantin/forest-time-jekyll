---
layout: post
title: "Building MVC structure with PHP"
date: 2017-05-01 12:11:29
categories: posts
comments: true
tags:  webdev
icon: html5
---

For [Web Security class](https://github.com/gaboratorium/keaproject2#web-security) we had to write a web application and secure it in any preferred language. Since PHP was showcased and introduced in all of the demos throughout the class, we decided to stick with it for the sake of simplicity. Furthermore, we also set the goal of building a proper MVC sturcture just to give ourselves some extra challenge.

In this tutorial I am going to write about the project's **structure**, touch upon the **.htaccess** file and talk about some apache configurations.

![PHP7](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2016/02/1457018224elephpant.jpg)
*Super PHP Elephant from [SitePoint](https://www.sitepoint.com/re-implementing-the-range-operator-in-php/)*

## Structure of the project

The main idea behind the architecture was that we wanted to access everything through `index.php` and forbid direct accessibility of any other files and folders.

```
- config/
- modules/
- helpers/
- services/
- css/
- libs/
- index.php
- .htaccess
```

We will access our **configuration files** from `config/` folder, such as database credentials, file paths or translation files, which have to be available throughout the entire application.

**Modules** will be a group of controllers and views, for example a *Login module* will have a *LoginController* and a *LoginView*. They will be responsible for handling the requests, processing data, and exposing data for the users.

Modules may use some **Helper classes** to use commonly used independent methods throughout the application (for example building links with a *LinkBuilder*, or authenticate the user with an *Authenticator*).

Module controllers will rely on **Services** to fetch data from the database. Only services will include SQL code. On any given parameters they will try to get the desired data and return it to the controller.

Of course, we will have separate folders for our CSS codebase and for our external libraries.

Every request will call `index.php` with some custom parameters, so everything will be centralized and will be under controll. Based on the inputs, an included `router.php` will handle the routing for us. But how do we force every traffic to go to `index.php`? We will use the `.htaccess` file.

## Configuring .htaccess

What is `.htaccess` at all? From [http://www.htaccess-guide.com](http://www.htaccess-guide.com):

> .htaccess is a configuration file for use on web servers running the Apache Web Server software. When a .htaccess file is placed in a directory which is in turn 'loaded via the Apache Web Server', then the .htaccess file is detected and executed by the Apache Web Server software. These .htaccess files can be used to alter the configuration of the Apache Web Server software to enable/disable additional functionality and features that the Apache Web Server software has to offer.

In order to make this configuration file work, we might have to change our apache settings in our `apache.conf`, which is located under `/etc/apache2/apache2.conf` in Ubuntu. Change `AllowOverride` from `none` to `All` like so:

```xml
 <Directory /var/www/>
        <!-- ... -->
        AllowOverride All
        <!-- ... -->
</Directory>
```

We need one more thing; we have to activate the `mod_rewrite` module on Apache. To do so, we have to use the following command:

```
sudo a2enmod rewrite
```

After that, don't forget to restart Apache:

```
sudo service apache2 restart
```

Now we can apply our own rules to handle requests coming to our Apache server.

### .htaccess file  

Let's rewrite some rules.

```apacheconf
# Disable directory listing
Options -Indexes

# URL Rewrite
RewriteEngine on
RewriteRule ^(modules/|common/|config/|helpers/|services/) - [F,L,NC]
RewriteRule ^([^/.]+)/?$ index.php?controller=$1&action=index
RewriteRule ^([^/.]+)/([^/.]+)/?$ index.php?controller=$1&action=$2
RewriteRule ^([^/.]+)/([^/.]+)/([^/.]+)/?$ index.php?controller=$1&action=$2&parameter=$3
```

First, the `Options -Indexes` line disables directory listing, so our files will not be listed when we request a folder without `index.php` or `index.html` on the server.

Then, we turn on the RewriteEngine, so we can set up our rules. Our first rule is about forbidding direct access to certain folders. This way the contents of those folders won't be accessable outside of `localhost` - only `index.php` will be able to `require` or `include` anything from these sources, any requests coming from different domains will be rejected.

The next few lines will translate **RESTFUL API-like URI**s into the language of our `index.php` using *regex*. So, for example `posts/edit/3` will be translated into `index.php?controller=posts&action=edit&id=3`.

At this point, we should not be able to access the mentioned folders, and when navigating to `libs` or `css` we should not get any lists of content - if that's the case, we are good to go.

## config/config.php

We will store a couple of our configurations in a `config.php` file, so we can avoid (or reduce so to speak) using hard coded values.

```php
<?php
  // Default module
  const DEFAULT_CONTROLLER = "Home"
  const DEFAULT_ACTION = "Dashboard"
  
  // Server configurations
  const SERVER_NAME = "localhost";
  const DB_USERNAME = "root";
  const DB_PASSWORD = "";
  const DB_NAME = "dbname";
?>
```

## index.php

```php
<?php
  require_once('config/config.php');

  $controller = DEFAULT_CONTROLLER;
  $action = DEFAULT_ACTION;
  $parameter = null;

  if (isset($_GET['controller']) && isset($_GET['action']))
  {
    $controller = strtolower($_GET['controller']);
    $action = strtolower($_GET['action']);
    $parameter = isset($_GET['parameter']) ? strtolower($_GET['parameter']) : null
  }
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My site</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <?php include_once("config/router.php"); ?>
</body>
</html>
```

After loading up our configuration file, we are going to set up a default controller and a default action right away.

If no controller and action will be defined as parameters, we are going to use these defaults, otherwise we define the setup as requested. An action parameter is often times optional or not required at all, so we build the requirements accordingly.

In the document body we are going to fire off the router, which will initiate the requested controller and trigger its action.

## config/router.php

```php
<?php
  function callAction($controller, $action, $parameter)
  {
      switch ($controller)
      {
        case "home":
          require_once("modules/HomeModule/HomeController");
          $controller = new HomeController();
          break;
        case "profile":
          require_once("modules/ProfileModule/ProfileController");
          $controller = new ProfileController();
          break;
        default:
          pageNotFound();
      }

      if (!method_exists($controller, $action))
      {
          pageNotFound();
      }
      if ($parameter)
      {
          $controller-> { $action }($parameter);
      }
      else
      {
          $controller-> { $action }();
      }
  }

  function pageNotFound()
  {
    // require_once("modules/HomeModule/HomeController");
    // $controller = new HomeController();
    // $controller->dashboard();
    echo "404 - Page not found";
  }

  callAction($controller, $action, $parameter);
?>
```

This file contains two simple methods: **callAction**, which will try to call the requested action, and **pageNotFound**, which will get called when something goes wrong when preparing the controller and its action. We can handle *pageNotFound* any way we wish; we can redirect the user if we want using the `header()` method, we can initiate any desired controller and kick-off one of its actions, or we can just simply echo an error message.

One thing to mention: instead of a *switch-case* statement, we could simply construct the location path string based on the controller name. However in that case we would have to check whether the requested file exists or not with `file_exists()`, which infers further security issues. Switch-case however has a white-listing approach where only accepted strings will execute further code.

Our router is ready, if we try to access a controller named other than *home* or *profile* (for example if our application is located at `localhost` then by calling  `localhost/posts` or `localhost/index.php?controller=posts`), we should get our 404 page.

However a site with only a 404 page is not much of a fun, so let's create our **HomeController class**.

## modules/HomeModule/HomeController.php

```php
<?php
  class HomeController 
  {
    private $breadcrumbs;
    private $view;

    public function __construct()
    {
      $this->breadcrumbs = "HomeController";
      $this->view = "modules/HomeModule/HomeView.php";
    }

    public function dashboard()
    {
      $breadcrumbs = $this->breadcrumbs + " / Dashboard";
      require_once($this->view);
    }

    public function inbox()
    {
      $breadcrumbs = $this->breadcrumbs + " / Inbox";
      require_once($this->view);
    }
    
  }
?>
```

Our **HomeController** will have two properties: some kind of data which we are going to process, and a view to expose it to the user. In the constructor we are assigning values to these properties: the data we will process is a simple breadcrumbs navigation. So our private property will hold the string `HomeController` by default, and we are going to concatenate further strings based on the action called by the user. After this tiny operation, we are going to reveal the result to the user through a view.

### modules/HomeModule/HomeView.php

```php
<nav>
  <?php echo $breadcrumbs; ?>
</nav>
<div>
  <h1>Hello baby, don't say maybe!</h1>
</div>
```

Now let's test this. If everything went well, assuming that our `index.php` is located in the root of `localhost`, we can access our methods at `localhost/home/dashboard` and `localhost/home/inbox`.

## Services

So far we have the View and Controller part of the MVC structure. Let's take care of the Model in the shape of **services**.

A service will be initialised with a database context. It will try to use this context to fetch the data from, and will always return the result, so the controller can do the error-handling.

Let's create a post service, which will be used to fetch all posts written by the users, or to retrieve one post fetched by its ID.

```php
<?php
  class PostService
  {
    private $db;
    function __construct($dbConnection)
    {
        $this->db = $dbConnection;
    }
    
    public function getPosts()
    {
      $sql = "SELECT * FROM POSTS";
      $stmt = $this->db->prepare($sql);
      if (!$stmt->execute())
      {
        return false;
      }

      $table = $stmt->get_result();
      return mysql_fetch_array($table, MYSQL_ASSOC);
    }

    public function getPostById($postId)
    {
      $sql = "SELECT * FROM POSTS WHERE ID = ?";
      $stmt = $this->db->prepare($sql);
      $stmt->bind_param('i', $postId);
      if (!$stmt->execute())
      {
        return false;
      }

      $table = $stmt->get_result();
      return mysqli_fetch_object($table);
    }
  }
?>
```

As we can see, this class needs a `DbContext` to be initialised with. Both of its methods return `false` if the script execution fails; otherwise they will return the result of the query. 

At this point this class is on its own, it is not included anywhere. We have 2 final things to do to connect the dots: first we have to create a **database connection**, which we can pass to the `PostService`, and then we have to include the `PostService` in our `HomeController`.

## helpers/DbContext.php

```php
<?php
   class DbContext
   {
    private $servername = SERVER_NAME;
    private $username = DB_USERNAME;
    private $password = DB_PASSWORD;
    private $dbName = DB_NAME;
    public $dbConnection;

    public function __construct(){
      $this->dbConnection = new mysqli(
          $this->servername,
          $this->username,
          $this->password,
          $this->dbName
      );
    }
  }
?>
```

That's it! Now, after including this helper class to our controller, we can easily initialise a database context by doing `$db = new dbContext()`, and we will be able to access its connection by `$db->dbConnection`. After creating our service with this helper, we will utilize the service to obtain and expose data to the users.

Our new `HomeController.php` will be:

```php
<?php

  require_once("helpers/DbContext.php");
  require_once("services/PostService.php");

  class HomeController 
  {
    private $breadcrumbs;
    private $view;
    private $PostService;

    public function __construct()
    {
      $db = new DbContext();
      $dbConnection = $db->dbConnection;
      $this->PostService = new PostService($dbConnection);
      $this->breadcrumbs = "HomeController";
      $this->view = "modules/HomeModule/HomeView.php";
    }

    public function dashboard()
    {
      $breadcrumbs = $this->breadcrumbs + " / Dashboard";
      $posts = $this->PostService->getPosts();
      require_once($this->view);
    }

    public function inbox()
    {
      $breadcrumbs = $this->breadcrumbs + " / Inbox";
      $posts = $this->PostService->getPostById(1);
      require_once($this->view);
    }
    
  }
?>
```
First we include our dependencies on the top, so we can use our `DbContext` and `PostService` classes. Then, in the constructor we intialise one instance of the `DbContext` and then, using its `dbConnection` property, we create our `PostService` instance, which is going to be a property of our `HomeController`.

Now, we can use this service in our controller, to get the desired data, by doing e.g.: `$posts = $this->PostService->getPosts();`.

All we have left to do is to reveal our data in our view:

```php
<nav>
  <?php echo $breadcrumbs; ?>
</nav>

<!-- Show posts if any -->
<?php if ($posts): ?>
  <div><?php var_dump($posts); ?></div>
<?php endif; ?>

<!-- Show post if any -->
<?php if ($post): ?>
  <div><?php var_dump($post); ?></div>
<?php endif; ?>
```
This way we managed to create a solid foundation for our application, which fulfills the separation of concerns princible by dividing our Modules into Views and Controllers and by having an isolated block for our Models in the shape of services.