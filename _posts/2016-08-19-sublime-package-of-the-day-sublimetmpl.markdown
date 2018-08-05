---
layout: post
title: "Sublime package of the day: SublimeTmpl"
date: 2016-08-19 10:07:44 +0200
audiopost: true
---
So far I have been enjoying Jekyll, but duplicating a post file to compose a new one (in order to keep the [Front Matter](https://jekyllrb.com/docs/frontmatter/) formatting) is sort of a pain in the butt, so I wanted to find another solution. First I was thinking about to write a gulp task, but gulp and npm are not installed on Jekyll by default so it seemed to be too much trouble. Eventually I found a more convenient solution: [SublimeTmpl](https://github.com/kairyou/SublimeTmpl) package.

With this package we can easily create file templates with some *dynamic* content inside, and assign commands and shortcuts to these actions.

## Creating a post template

### 1. Create a new command in `Default.sublime-commands`: 

```json
{
  "caption": "Tmpl: Create post", "command": "sublime_tmpl",
  "args": {"type": "post"}
}
```

### 2. Create a caption in `Main.sublime-menu`:

```json
{
  "caption": "post",
  "command": "sublime_tmpl",
  "args": {
  	"type": "post"
  }
}
```

### 3. Assign extension and syntax highlighting to your new type in `SublimeTmpl.sublime-settings` (User):

```json
{
  "post": {
    "syntax": "Packages/Markdown/Markdown.tmLanguage",
    "extension": "markdown"
  }
}
```

### 4. Create the template in `SublimeTmpl/templates`:

```yaml
---
layout: post
title: "${1:Post title}"
date: ${date}
categories: posts
tags: ${2:tag1} ${3:tag2} ${4:tag3}
---
${5: Write your post...}
```

The numbered fields make it possible to jump between these sections with `TAB`.

### 5. Assign a shortcut to the command in your `.sublime-keymap` (User):

```
{
  "keys": ["ctrl+alt+p"], "command": "sublime_tmpl",
  "args": {"type": "post"}, "context": [{"key": "sublime_tmpl.python"}]
}
```