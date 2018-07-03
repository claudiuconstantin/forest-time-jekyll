---
layout: post
title: The smallest Java app
date: 2017-08-03 09:11:29
published: false
published: false
---

Given the following structure:

```
README.md
gradle.build
src/
  main/
	  com/
		  gaboratorium/
			  greeter/
				  Main.java
```

The application:

```java
// Main.java

package com.gaboratorium.greeter;

import java.util.Arrays;

public class Main {
	public static void main(String[] args) {
		System.out.println(Arrays.toString(args));
	}
}

```

The build script:

```groovy
apply plugin: "java"
apply plugin:'application'

mainClassName = "com.gaboratorium.greeter.Main"

sourceSets {
	main.java.srcDir "src/main"
	test.java.srcDir "src/test"
}

jar {
	manifest {
		attributes "Main-Class": "com.gaboratorium.greeter.Main"
	}
}
```
