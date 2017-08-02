---
layout: post
title: How to connect to PostgreSQL with Java
date: 2017-08-01 09:11:29
---

1. Download and start PostgreSQL from [https://www.postgresql.org/](https://www.postgresql.org/)
1. Add the `postgresql` dependency in your `build.gradle` file (`compile group: 'postgresql', name: 'postgresql', version: '9.0-801.jdbc4'`)
3. You are ready to connect to PostgreSQL with for example the following program:


```java
package hello;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class HelloWorld {

    private final String url = "jdbc:postgresql://localhost:5432/postgres";
    private final String username = "postgres";
    private final String password = "your-password";

    public Connection connect() {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e ) {
            System.out.println("Where is your PostgreSQL JDBC Driver? "
                    + "Include in your library path!");
            e.printStackTrace();
        }

        Connection c = null;

        try {
            c = DriverManager.getConnection(url, username, password);
        } catch (SQLException e) {
            System.out.println("Connection Failed! Check output console");
            e.printStackTrace();
        }

        if (c != null) {
            System.out.println("You made it, take control your database now!");
            return c;
        } else {
            System.out.println("Failed to make connection!");
            return null;
        }
    }

    public static void main(String[] args) {
        HelloWorld hello = new HelloWorld();
        hello.connect();
    }
}
``` 
