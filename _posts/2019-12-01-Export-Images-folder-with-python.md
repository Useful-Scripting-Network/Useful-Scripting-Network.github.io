---
title: 'Export images folder to HTML page'
date: Sun, 01 Dec 2019 19:48:22 +0000
categories: Python
tags: ['Python']
classes: wide
author: Clayton Errington
---

Often times we have a lot of images in a bunch of folders, and we need to go through the files to review them. I will show how we can use Python's [glob()](https://docs.python.org/3/library/glob.html), [enumerate()](https://docs.python.org/3/library/functions.html#enumerate), [os()](https://docs.python.org/3/library/os.html) library for files, and simple exporting data to an HTML file.

First we need to import and open start our file for exporting.

```python
import glob, os

f = open("export.html","a+")
f.write("""<html>
<head>
    <title>Python IMG Export</title>  
    <style>  
        img { 
            width: 200px; 
            height: 200px; 
            object-fit: contain; 
        } 
    </style>  
</head>  
<body>""")
```

Opening a file with the attribute a+ will create a new file if it does not exist and leave it open while we append data to the file. Next we start some basic HTML text to start our page.

Lets start to gather details about our files by printing our total files to the console and the HTML file.

```python
# set up variables and path
fileCount = 0
dirCount = 0
# use the current directory
PATH="."

for root, dirs, files in os.walk(PATH):
    #print('Looking in:',root)
    for directories in dirs:
        dirCount += 1
    for Files in files:
        fileCount += 1

print('Number of files',fileCount)
f.write('Number of files %d' % fileCount)
```

We now have our file count, lets do something with it.

```python
os.chdir(".")
lst = glob.glob('\*\*/\*\*/\*.jpeg')
for ind, smb in enumerate(lst):
    print(smb, end='')
    f.write("<td><img src='%s' /></td> \r\n" % smb)
    if ind%5 == 4: 
        print('\\n')
        f.write('</tr><tr> \r\n')
        
        
f.write('</table></body></html>')
f.close()
```

To begin we start with a glob of all our images in the folders since that is all we care about if there are other files like text files or PDFs. The glob function allows for three sub folders deep to look for the JPEGs in this case.

Then we setup our for loop to write to our HTML file using tables. I wanted to have 5 cells then start a new line. That is where the ind%5 ==4 comes in play. This looks at the enumerated list and prints a new line, or in HTML closes the row and starts a new one.

Once done, we need to close the HTML file properly, and the file. Then the HTML file looks similar to the below.

```html
<html>
<head>
    <title>Python IMG Export</title>  
    <style>  
        img { 
            width: 200px; 
            height: 200px; 
            object-fit: contain; 
        } 
    </style>  
</head>  
<body>
Number of files 10
<table>
    <tr> 
        <td><img src='Images\2018\1.jpeg' /></td> 
        <td><img src='Images\2018\2.jpeg' /></td> 
        <td><img src='Images\2018\3.jpeg' /></td> 
        <td><img src='Images\2018\4.jpeg' /></td> 
        <td><img src='Images\2018\5.jpeg' /></td> 
    </tr>
    <tr> 
        <td><img src='Images\2018\6.jpeg' /></td> 
        <td><img src='Images\2018\7.jpeg' /></td> 
        <td><img src='Images\2018\8.jpeg' /></td> 
        <td><img src='Images\2018\9.jpeg' /></td> 
        <td><img src='Images\2018\\0.jpeg' /></td> 
    </tr>
</table>
</body>
</html>
```

Some take away's for you to try is customize the title with the starting folder name and add arguments to allow for a different starting folder.

View the full source code on our [GitHub](https://github.com/Useful-Scripting-Network/Python/blob/master/exportimg.py) repo.