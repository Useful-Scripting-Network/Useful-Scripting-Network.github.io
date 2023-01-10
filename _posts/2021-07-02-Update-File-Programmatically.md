---
title: Updating File Programmatically
date: 2021-07-02T01:13:59.499Z
template: "post"
category: "Computers"
tags: ["filesystem", "Automation"]
excerpt: Quick demonstration of how to update a file programatically
classes: wide
author: Clayton Errington
---

When working with text based files there might be a time to update the contents. PowerShell has a `Get-Content` Commandlet that gathers the content of a file and renders it to the console or saved in a variable. Once we get the content we can then manipulate it and save that back out. 

## So whats the goal? 

To get the content of a file and update it with new information and save it, all without manually updating the file. This is helpful when replacing a lot of text within files. 

## Getting started

We will need a filepath, an old value, and a new value. We'll get the contents of the file, and use the `.replace()` method from the `string` class. 

In general our line would be:

```text
The brown dog jumped over the fence
```

But lets replace `fence` with `moon`. So we'll start by writing

```powershell
"The brown dog jumped over the fence".replace("fence","moon")
```

and well see our console output 

```text
The brown dog jumped over the moon
```

## Setting up the function

Writing our update file into a function allows us to reuse the command and ensure we keep things consistent. 

Setting up our update command to get the file and replace a value: 

```powershell
(Get-Content dog.txt).replace("fence", "moon") | Set-Content dog.txt
```

This will get the content of dog.txt, find all references to `fence` and replace them with `moon`. Once done, the `Set-Content` method will write the new contents to the file. 

Lets add this to a function so its more usable and understandable. 

```powershell
function UpdateFile{

    param(
    [Parameter(Position=1)]
    $filepath, 

    [Parameter(Position=2)]
    $oldvalue,
        
    [Parameter(Position=3)]
    $newvalue 

    )

    Write-Host "Updating $filepath. Changing $oldvalue to $newvalue"
    (Get-Content $filepath).replace($oldvalue, $newvalue) | Set-Content $filepath

}
```

Now we have our function made we can call it easily by doing

```powershell
UpdateFile -filepath c:\dog.txt -oldvalue "fence" -newvalue "moon"
```

## Wrap up

You can use the function anywhere you'd like to in your PS1 file then call it with the values needed. 

Extra tip: to update a value and remove it, the `-newvalue` can be a set of double quotes to be blank `""`.
