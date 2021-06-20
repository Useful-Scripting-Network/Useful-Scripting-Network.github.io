---
title: 'Touch command in PowerShell'
date: Tue, 22 Sep 2020 21:04:44 +0000
draft: false
tags: ['Powershell']
---

One of my favorite commands from the Linux terminal is the [touch](https://ss64.com/bash/touch.html) command. This is a way for users to create or modify files and their timestamp information. The following function is just a simple way to create an empty file or to update the Last Write Time attribute for a file.

In many of my scripts or starting a new project I need to create a temp file or a new file before opening it to begin the task at hand.

```
# Add nix-like touch command
Function touch
{
    $file = $args[0]

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
        # If file exists update the last write time to now.
        (Get-ChildItem $file).LastWriteTime = Get-Date
    }
    else
    {
        # Create the file UTF-8 and with .NET classes to ensure compatibility
        [IO.File]::WriteAllLines("$pwd\$file", "")
    }
}
```

This method is very basic and will create a blank file if it does not exist. That was the purpose of my Touch command. There are [others out there](https://ss64.com/ps/syntax-touch.html) which are a little more robust and similar to the Bash command.