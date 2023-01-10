---
title: 'Uppercase user input'
date: Fri, 29 Nov 2019 16:17:03 +0000
categories: PowerShell
tags: ['PowerShell']
classes: wide
author: Clayton Errington
---

During user input we need to perform some string functions to put the name in a proper format because lets be honest, no one always types correctly.

This will also benefit the times we need to sanitize input too. To begin, lets set up some user inputs. Create two variables for the first name and last name.

```powershell
$givenname = Read-Host "First Name" 

$sn = Read-Host "Last Name" 
```

Now the shell will stop and ask for user input. Fill in your first and last name in lowercase or however you'd like to. We'll fix that in a moment.

```
$givenname = $givenname.substring(0,1).toupper()+$givenname.substring(1).tolower() 
```

We'll update the $givenname variable and use the substring method to get the first character $givenname.substring(0,1) then add the toupper() method to capitalize the first character.

Next, we'll get the rest of the string and set it to lower, $givenname.substring(1).tolower().

Now that we have updated the given name, we can do the same to the lastname.

```
$sn = $sn.substring(0,1).toupper()+$sn.substring(1).tolower()
```

Once we put all that together we can print the user input.

```
Write-Host "First Name: $givenname"
Write-Host "Last Name: $sn"
```

When you enter the name john smith, PowerShell will change it to John Smith for us.

View the source code on our [Github Repo](https://github.com/Useful-Scripting-Network/PowerShell/blob/master/Uppercase.ps1).