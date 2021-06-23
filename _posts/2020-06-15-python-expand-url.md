---
title: 'Python: Expand URL'
date: Mon, 15 Jun 2020 04:34:22 +0000
categories: Python
tags: ['Web']
classes: wide
author: Clayton Errington
---

Python has many great modules to deal with HTTP connections. A simple one to look at to day is the [requests](https://pypi.org/project/requests/) module. We'll look at how to query the HTTP request for the HEAD information and get the Location to resolve a URL to its full location.

Why is this needed or helpful? Many times we are given a short URL and our program requires the full URL. In a recent downloading script the function would use the last URL part as the file name. This works well to download the file but wouldn't name the file correctly.

For example the SSMS download from Microsoft is currently https://aka.ms/ssmsfullsetup. The download script would use "ssmsfullsetup" as the filename for the download. This file has no extension and makes it harder to parse the script or adds more unneeded steps. So finding the final Location helps with this.

First we will handle all the steps with the requests module so lets begin our import and setting up our function.

```python
import requests

def resolver(loc, verbose=False, hops=1):
    if(verbose): 
        print(f"{hops}: {loc}") 
        hops=hops+1
    # get the head request
    url = requests.head(loc)
    # get the Location from the HEAD
    url = url.headers\["Location"\]
    # compare current URL to the next URL if different proceed with the next location
    # then return the final URL
    try:
        nexturl = resolver(url, verbose, hops)
        if nexturl == url:
            pass
        else:
            return nexturl
    except:
        return url
```

We need this function to be recursive so the URL keeps searching for the final destination. In the case of the SSMS download we can see when running Verbosely we go through a few redirects:

```text
1: https://aka.ms/ssmsfullsetup
2: https://go.microsoft.com/fwlink/?linkid=2132606
3: https://download.microsoft.com/download/d/1/c/d1c74788-0c6b-4d23-896e-67cf849d31ed/SSMS-Setup-ENU.exe
https://download.microsoft.com/download/d/1/c/d1c74788-0c6b-4d23-896e-67cf849d31ed/SSMS-Setup-ENU.exe
```

Hop 3 is the final destination and is returned for final use. Now in my download script we can use this final URL since the filename will end up being SSMS-Setup-ENU.exe.

For our website we have a .COM domain since the .NETWORK domain can be hard to find and the Location in the HEAD can help forward the user to our website.

```text
1: http://usefulscripting.com/
2: http://usefulscripting.network
http://usefulscripting.network
```

Since this is a simple function we can just call the function and print the results. If we want to see the redirects we can with the verbose option.

```python
print(resolver("http://usefulscripting.com/", verbose=True))
```

Lets try this short url, [http://shorturl.at/lqtN2](http://shorturl.at/lqtN2), and see where the redirects are going:

```python
print(resolver("http://shorturl.at/lqtN2", verbose=True))
```

```text
1: http://shorturl.at/lqtN2
2: https://www.shorturl.at/lqtN2
3: http://usefulscripting.network/python/python-expand-url/
http://usefulscripting.network/python/python-expand-url/
```

Source code is on our [GitHub repo](https://github.com/Useful-Scripting-Network/Python/blob/master/urlexpand.py)