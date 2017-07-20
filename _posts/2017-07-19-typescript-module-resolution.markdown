---
layout: post
title: TypeScript module resolution
date: 2017-07-19 09:11:29
---
The official TypeScript documentation about [modules](https://www.typescriptlang.org/docs/handbook/modules.html) and [module resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html) already provide a great set of information, but here are my notes which sums up the most important know-hows.

![TypeScript](https://blog.dashlane.com/wp-content/uploads/2016/04/typescript-cover-image.jpg)

- If you we want to import, we always have to export first.
- We don't have to specify the filename, this way the compiler will look for the `index.ts` file in the given directory.
- Imports are either relative (to the current file) or absolute to the `baseUrl` which is either the default value, or passed as an argument when the compiler is called, or defined in `tsconfig.json`, e.g.: `"baseUrl": "./src/"`.
- We can import modules explicitly using curly brackets e.g.: `import { myModule } from './myModule` and they can be renamed e.g.: `import { myModule as myRenamedModule } from 'myModule'`.
- We can import all the exported modules using the asterisk (`*`) character, this way all the modules will be nested under the given variable, e.g.: `import * as myImportedModules from './foo/bar/myModule'`.
- We can export either at declaration, or after declaration using curly brackets e.g.: `export { app };`.

## Example


```ts
// ./animals.ts
export interface IAnimal {
	name: string,
	legs: number,
	sayHi?: any
}

export const elephant: IAnimal = { 
	name: "Dumbo",
	legs: 4,
	sayHi: function() {
		console.log("Toot!");
	}
}

export const cow: IAnimal = {
	name: "Emma",
	legs: 4,
	sayHi: function() {
		console.log("Boo!");
	}
}

const cat: IAnimal = {
	name: "Daisy",
	legs: 4,
	sayHi: function() {
		console.log("Meow!");
	}
}

export { cat };
```

```ts
// ./index.ts
import * as animals from "./animals";
import { cow } from "./animals";
import { cat as daisy } from "./animals";

var dumbo = animals.elephant;
dumbo.sayHi();

var emma = cow;
emma.sayHi();

var fifi: animals.IAnimal = {
	name: "fifi",
	legs: 4,
	sayHi: function() {
		console.log("Woof!");
	}
}
fifi.sayHi();

daisy.sayHi();

```