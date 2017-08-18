---
layout: post
title: Kotlin for Web tutorial
date: 2017-08-03 09:11:29
published: false
---

## Getting started with Kotlin and Gradle

1. Download IntelliJ IDEA Community Edition (try to be as least IDE specific as possible)
2. Create a Gradle project (including Kotlin) - describe `gradle.build`
3. Create `Main.kt` running Hello World, run the file.
4. Rename `Main.kt` to `App.kt` (Refactor > Rename) and make it the main class of the app.
  1. Use Object Declaration - [help on StackOverflow](https://stackoverflow.com/documentation/kotlin/490/getting-started-with-kotlin#t=201708040843022842396)
	2. Use `@JvmStatic` on `main` function
	3. Edit Run Configurations - Rename Main class from `AppKt` to `App`

## Getting started with Spark

1. Introduce Spark. Tell why using a Framework helps at the beginning. Tutorials > Gradle Setup then Using Spark with Kotlin. Run the app. Show how to stop it.
2. Add Spark to our Gradle project - [help on Spark Tutorials](http://sparkjava.com/tutorials/gradle-setup)
3. Write a simple endpoint in Kotlin - [help on Spark Tutorials](http://sparkjava.com/tutorials/kotlin)
2. Tell about Async and Coroutines.
3. Connect it with PostgreSQL.