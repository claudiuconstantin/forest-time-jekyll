---
layout: post
title:  "C# and .NET basics 2.: Generics"
date:   2016-07-26 20:23:16 +0200
categories: posts
comments: true
tags: C# .NET
---
I have been doing some refactoring in TypeScript for the last few days, and just started to feel the need, and understand the benefits of writing strongly typed code. Let’s have a look at an approach which can help us to achieve that in C#; the generics.

With generics we can create a class once, and then we can reuse it multiple times, with multiple types in a very performance-friendly way. It makes our code type independent.
In the following example we would like to compare objects to each other with the same type.

## The issue
Probably the easiest approach to write such a comparison could be something like this:

```
public class Calculator
{
  public static bool areEqual(object value1, object value2)
  {
    return value1.Equals(value2);
  }
}
```

And then, simply using this class:

```
bool Equal = Calculator.areEqual(10,10);
```

As you can see, we can define our parameters as objects, because in .NET object is the parent class of every type. This way we can pass any types, for example integers in this case.

However this also means that at runtime, the value types will have to be converted into a reference types, this process is called boxing. Whenever we would like to access these values, we have to unbox them. These methods have performance penalties.

Another issue with this approach, is that it lets us do things like:

```
bool Equal = Calculator.areEqual(10, “banana”)
```

which does not make much sense, but most importantly we will lose our strongly-typed nature of our application.
With generics we can easily get around these 2 problems.

## Creating a generic class
Let’s create a generic class.

```
public class Calculator
{
  public static bool areEqualL<T>(T value1, T value2)
  {
    return value1.Equals(value2);
  }
}
```

Inside angle-brackets we indicate the type our parameters will have. T can be basically anything, using T is a common naming convention as it can stand for Type or Template. Our parameters will have this type, which can be anything, integer or string for instance.
When calling this generic method, we have to specify with angle-brackets again the type we are going to use:

```
bool Equal = Calculator.areEqual<int>(10, 10)
```

As soon as we do this, IntelliSense will guide us and give us hints, when providing parameters.

This way we reset the strongly-typed nature of our application. Furthermore we avoided boxing and the performance loss which comes along with it.

## References
  -Part 56 C# Tutorial Generics in C# by kudvenkat: [https://www.youtube.com/watch?v=-zHRmXkJ5Bw](https://www.youtube.com/watch?v=-zHRmXkJ5Bw)
  -C# Generics Tutorial: Whats and Whys by Programming with Mosh: [https://www.youtube.com/watch?v=gyal6TbgmSU&index=4&list=PLF697Yv1UIHoCJdqJyTVMikRzXV5h_6ve](https://www.youtube.com/watch?v=gyal6TbgmSU&index=4&list=PLF697Yv1UIHoCJdqJyTVMikRzXV5h_6ve)