---
title: 'How to Touch files in Powershell'
date: Tue, 07 Jan 2020 04:07:44 +0000
categories: Powershell
tags: ['Windows']
classes: wide
author: Clayton Errington
---

When working in a terminal a lot we learn several built in commands that we start to lean on those commands and tools in our everyday life.

In Powershell there is not a simple way to create a file quickly. Sure we can do something like the following, but this is a long way to write something so simple.

```powershell
Set-Content test.txt ""
```

Powershell has a Set-Content function to create files or change the content of a file, but when creating a file quickly that is a lot of characters to type. Let's shorten that with a simple Powershell function we can use in a script or our profile.

```powershell
function touch
{
    $file = $args0]

    if($file -eq $null) 
    {
        Write-Host "No filename supplied"
        Write-Host ""
        Write-Host "Usage: touch file.txt"
        Write-Host "Will create file if it does not exist, and update the last modified time if it does."
        Write-Host "Similar to the unix command"
        break
    }

    if(Test-Path $file)
    {
        (Get-ChildItem $file).LastWriteTime = Get-Date
    }
    else
    {
        # UTF-16 LE
        # echo $null > $file

        # UTF-8 With BOM
        # $null | Out-File $file -Encoding "UTF8"
        
        # UTF-8 W/O BOM
        [IO.File]::WriteAllLines("$pwd\$file", "")
    }
}
```

So we can now just call this function to create a blank file much more quickly and efficiently. We just need to call touch file.txt.

```powershell
touch filename.txt
```

There no output of the touch command if it completes successfully, as this is the standard outcome. This allows you to create a scaffolding of files quickly.