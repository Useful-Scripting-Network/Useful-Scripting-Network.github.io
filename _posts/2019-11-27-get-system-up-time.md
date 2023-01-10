---
title: 'Get System Up time'
date: Mon, 17 Feb 2020 22:54:13 +0000
layout: single
categories: PowerShell
tags: ['Windows']
classes: wide
author: Clayton Errington
---

Getting the system up time on Windows servers or desktops is a needed task every so often. This information can be found a different ways but occasionally we need this information in our script.

Today we will used PowerShell to get this information.

```powershell
function Get-SystemUptime
{
    $operatingSystem = Get-WmiObject Win32_OperatingSystem
    [Management.ManagementDateTimeConverter]::ToDateTime($operatingSystem.LastBootUpTime)
}

$uptime = Get-SystemUptime
Write-Host "The system was last booted at: $uptime"
```

We start by querying the WMI of the system and storing that in a variable. From there we call a .NET function to convert the UNIX time to a human readable time.

When running the ```Get-WmiObject Win32_OperatingSystem``` command we get a limited output but can add ```Get-WmiObject Win32_OperatingSystem | Select *``` and we can see the full list of properties. Once we get all the properties we see a LastBootUpTime property, but this is a UNIX like time and we need to convert it.

The .NET class will convert the time to Date Time format.

The console will finally output ```The system was last booted at: 02/17/2020 12:48:15```