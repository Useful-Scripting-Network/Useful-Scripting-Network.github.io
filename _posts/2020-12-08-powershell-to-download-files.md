---
title: 'Using PowerShell to Download Files'
date: Tue, 08 Dec 2020 21:08:54 +0000
draft: false
tags: ['Computers', 'Featured', 'Powershell', 'Windows']
---

How else do you get files these days but downloading files. This could be for a deployment purpose or to just use the terminal to download a file without using your browser.

So what should we start with? We've all heard of `curl` but in PowerShell this is just an alias of `Invoke-WebRequest`. Okay so now what? Basically this method is a simple way to get content form a web page on the Internet.

From the Get-Help command we read the description.

> The Invoke-WebRequest cmdlet sends HTTP, HTTPS, FTP, and FILE requests to a web page or web service. It parses the response and returns collections of forms, links, images, and other significant HTML elements.
> 
> Get-Help module

Just with all Requests objects there are plenty of ways to interact with a web page from the terminal but today we'll go over how to download files. I will use the popular text editor Notepad++ and the following link: https://github.com/notepad-plus-plus/notepad-plus-plus/releases/download/v7.9.1/npp.7.9.1.Installer.exe

PowerShell needs to know the TLS Security Protocall to use and we'll start by making our URL and object.

```
# Set TLS support for Powershell and parse the JSON request
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$npp = Invoke-WebRequest -UseBasicParsing 'https://api.github.com/repos/notepad-plus-plus/notepad-plus-plus/releases/latest' | ConvertFrom-Json
```

Now if we were to echo the `$npp` to the console we'd see the JSON object in a human readable method. Next we need to get our download URL and the name of the file as well. These can be found in the 4th child item for the 64bit installation file.

```
$dlUrl = $npp.assets[4].browser_download_url 
$nppinstallfile = $npp.assets[4].name
```

This will yield our URL mentioned above and the name of the executable file, npp.7.9.1.Installer.x64.exe. Since the GitHub API URL is always the latest, it'll get updated every time there's a new build and our script will continue to work. Now all we need is to download the installer.

```
# Start the download and save the file to the $nppinstallfile
Invoke-WebRequest -UseBasicParsing $dlUrl -OutFile $nppinstallfile
```

-OutFile will download the file in the current working directory of our script or terminal location.

In the full script I have done some conditional items to download the file based on the operating system whether 32 or 64 bit and parsing the hashes to ensure we have a good file that is not corrupt and is the same as the publisher.

<a href="https://gist.github.com/cjerrington/bc95d40750c04680d814dc42fda2b6c6">View this gist on GitHub</a>