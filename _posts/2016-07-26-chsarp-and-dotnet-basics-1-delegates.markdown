---
layout: post
title:  "C# and .NET basics 1.: Delegates"
date:   2016-07-26 19:23:16 +0200
---
The other day I got encouraged to start documenting my learning process, as it helps to summarize and clarify new things I have read about and also, some may find it helpful.

So here we go. However, keeping in mind that the primary goal will be to examine something I have been working with lately, and I would like to make it quick, the content will be rather raw and sketchbook-like without much formulating effort, but feel free to leave any feedback.
So, let’s get ready to Rambo with the first topic: C# and .NET basics. 

I can say I am almost completely new to this topic, however I have some experience with the C family as I took some courses about C++ 3–4 years ago, but let’s start with some really basic stuff.

This article will include some general theories about C# and .NET, and at the end we will jump into practice and do some coding to learn about delegates.

## What is C# and .NET and what are the differences?

The fundamentals: C# is a programming language, meanwhile .NET is a framework for building applications on Windows. .NET can be targeted by different languages (such as F#) therefore it is not limited for C# only. It consists of 2 main components:
  -CLR (Common Language Runtime)
  -Class libraries

### What is CLR?
Microsoft borrowed this from the Java community, where when you compile your code it is not translated directly into machine code, but to an intermediate language called ByteCode, so it will be able to run on different platforms. 

The scenario is the same with .NET: When you compile your code the result will be IL (Intermediate Language), which will be independent from the computer which it is running on.
But we still need to translate this IL into machine code. That’s the job of the CLR, and this process is called Just-in-time Compilation (JIT).
With this architecture, our application can run on any platform which has CLR.

### What is a class library?
Let’s have a look at .NET application architecture: Our main building bricks will be classes, which will contain data (attributes) and methods (functions).
We will organize our classes and put them into namespaces. A namespace is a container of related classes.
If we want to use a class in our codefile defined in another namespace, we have to indicate that by using the using statement e.g.:
using System
which is a default .NET namespace for default built in utility classes and primitive types.
We will also organize our namespaces and put them into Assemblies (DLL or EXE). An assembly is a container of related namespaces. Our application will consist of assemblies.

## Type conversion

### Implicit type conversion

Implicit type conversation happens when the compiler is positive about the data types being compatible and no data loss will happen. Values will be able to be converted to a different type implicitly.

```csharp
// Example 1
byte b = 1;
int i = b;
//Example 2
int i = 1;
float f = i;
```

The size of an integer is compiler dependent, nowadays usually 4 or 8 bytes. It means when we convert a byte type value into an integer, no data loss will happen, implicit conversion will be valid.
Explicit type conversion (casting)
Let’s try the other way around and see if it works (spoiler alert: it won’t).

```csharp
// Example 1
int i = 1;
byte b = i;
// Example 2
int i = 300;
byte b = i;
```

In the first scenario 3 bytes out of 4 will be lost, and data loss may happen. Data loss only happens if the information stored in the integer is beyond the capacity of a byte. In the first example, as 1 can be stored in a byte as well, no data will be lost.

However the number 300 is beyond the capacity of a byte (255), cannot be stored in byte, so we will experience data loss.
When the compiler notices that there is a chance of data loss, it will not allow implicit type conversation. That’s when we can use explicit type conversation, and use casting.
What we need to do, is to prefix the target variable with the target type.

```csharp
int i = 300;
byte b = (byte)i;
```

## Conversation between non-compatible types
It may happen that we want to convert types which are not compatible with each other. Explicit type conversation won’t help us here, so we will have to use the Convert class, or use the Parse method.

```csharp
string s = "1";
int i = Convert.ToInt32(s);
int j = int.Parse(s);
```

## Exception handling
Exception is .NET error reporting mechanism. Let’s have a look how to handle exceptions. In the following example we are trying to assign a value to a byte, which will overflow, as 1245 is to big to be stored in a byte.

```csharp
var number = "1234";
byte b = Convert.ToByte(number);
Console.WriteLine(b);
```

We will get a System.OverflowException error, whichactually happens during conversion. What we can do, is to wrap the script with a try-catch block.

```csharp
try {
  var number = "1234";
  byte b = Convert.ToByte(number);
  Console.WriteLine(b);
}
catch(exception) {
  // handle exception
}
```

This way we can prevent the .NET runtime application to stop our application, and handle the error.

## Delegates
Delegates are similar to function pointers. As you may assume from the name, delegates are message carriers; they let communication happen between different components. To be more precise, a delicate is a representative to communicate between to parties. First, let’s see how they work and how can we create them, and then we will have a look at their benefits and handful usage.
First, let’s define a method, which we will use to represent the usage of the delegate.

```csharp
// 1. Create a regular method
static void SomeMethod()
{
  Console.WriteLine(“Method called”);
  Console.ReadKey();
}
```

Then we will create a delegate, and then an object of it (inside our Main function).

```csharp
// 2. First create a delegate
public delegate void SomeMethodDelegate();
// 3. Then create an object
static void Main(string[] args)
{
  SomeMethodDelegate obj = new SomeMethodDelegate(SomeMethod);
  obj.Invoke();
}
```

If we build and run our tiny application we will see that our method will be invoked. That’s fine but what’s the point? How is this helpful? We could have just simply called the method itself and end up with the same result.
What is the benefit of calling a function indirectly via a delegate pointer?
Imagine the following scenario: we have an empty 1000 ml bowl, which we are filling up with water.

We have 3 weighting scales which we can put the (empty) bowl on at the beginning:
`DisplayWaterLevel` will tell us how much water we have in the bowl (in ml).
`DisplayAvailableSpace` will tell us how much more water we need to completely fill the bowl (also in ml).
`DisplayIfFull` will tell us whether the bowl is full or not (yes or no).
And no matter what weighting scales we put our bowl at the beginning, we have one restriction: we would like to see a number. How can we achieve that programmatically?

Well, one approach is using delegates of course.
Let’s code our 3 weighting scales first, they can look like something like this:

```csharp
static void DisplayWaterLevel(int i)
{
  Console.WriteLine(i);
}
static void DisplayAvailableSpace(int i)
{
  Console.WriteLine(1000 — i);
}
static void DisplayIfFull(bool m)
{
  Console.WriteLine(m);
}
```

As you can see, all these function do is they print whatever they get, nothing fancy. Our bowl will be quite simple as well.

```csharp
class Bowl
{
  public void PouringWater()
  {
    for (var i=0; i<1000; i++)
    {
      //Pouring i ml water
    }
  }
}
```

Our bowl class has one method which when is called, fills up our bowl ml by ml. We of course call this method in our Main function:

```csharp
static void Main(string[] args)
{
  Bowl obj = new Bowl();
  obj.PouringWater();
}
```

Now, if we wanted to measure this bowl, we could call any of the predefined methods (weighting scales) inside the loop, however this approach would let us to use DisplayIfFull as well, which we want to avoid, as we would like to see only a number, bool is not allowed.
This is where delegates come into play. Let’s create one inside our Bowl class:

```csharp
class Bowl
{
  public delegate void Scale(int i);
  public void PouringWater(Scale obj)
  {
    for (var i=0; i<1000; i++)
    {
      //Does something
      obj(i);
    }
  }
}
```

There are 3 differences we should spot: first the delegate declaration, then the expected argument on the function PouringWater, and then calling that argument.

So we declared a delegate called Scale, and we stated that this delegate expects an integer. Then, we stated that we are expecting a delegate (aka function) as a parameter when calling PouringWater. We also said that we are going to reference this method as obj.
And inside the loop we are simply referring to that.

Now, we have to change our PouringWater call, as it expects a method as parameter:

```csharp
static void Main(string[] args)
{
  Bowl obj = new Bowl();
  // Scenario 1. - will be ok
  obj.PouringWater(DisplayWaterLevel);
  // Scenario 2. - will be ok
  obj.PouringWater(DisplayAvailableSpace);
  // Scenario 3. - oh-oh
  obj.PouringWater(DisplayIfFull);
}
```

Now you can see. Because our pointer expects ant integer as parameter, it won’t allow DisplayIfFull to become the delegate method, as it expects a bool type parameter instead of an int.
Eventually our scales (=methods) became callback functions of our PouringWater function, but we managed to restrict what kind of functions we allow.

## In summary delegates…
  -…are type safe function pointers
  -…allow methods to be passed as parameters
  -…can be used to define callback methods
  -…can be chained together, and multiple methods can be called on a single event

## References
  - This article was written mainly based on one of Mosh Hamedani’s tutorial which I highly recommend to watch: C# Tutorial for Beginners: Learn C# from Scratch by Programming with Mosh: [https://www.youtube.com/watch?v=gfkTfcpWqAY](https://www.youtube.com/watch?v=gfkTfcpWqAY)
  - Delegates (C# Programming Guide) by MSDN: [https://msdn.microsoft.com/en-us/library/ms173171.aspx](https://msdn.microsoft.com/en-us/library/ms173171.aspx)
  - C# delegates explained by .NET Interview Preparation videos: [https://www.youtube.com/watch?v=ifbYA8hyvjc](https://www.youtube.com/watch?v=ifbYA8hyvjc)