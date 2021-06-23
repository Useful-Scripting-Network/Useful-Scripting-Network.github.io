---
title: 'Automate File Organizing'
date: Fri, 07 Feb 2020 19:16:31 +0000
categories: Python
tags: ['Linux', 'Windows']
layout: single
classes: wide
author: Clayton Errington
---

On our systems we use a lot of files and end up with a lot of clutter. Sometimes it can be hard to look through all those files and determine what is needed. Maybe we need to break up the files but file type and go through them that way. Or we need all the files and need to organize them.

Today we'll look at two methods of organizing files with Windows Batch scripting and Python.

We will clean this up.

![](http://usefulscripting.network/wp-content/uploads/2020/02/fileorganize.jpg)

Using automation to clean up the files in a directory

Windows Batch File Automation
-----------------------------

The Windows Batch method loops through all the files in the current directory and will create a directory for the file extension and then move that file to the folder. Let's take a look...

```shell
@echo off

rem For each file in your folder
for %%a in (".\\\*") do (
	rem check if the file has an extension and if it is not our script
	if "%%~xa" NEQ "" if "%%~dpxa" NEQ "%~dpx0" (
		rem check if extension folder exists, if not it is created
		if not exist "%%~xa" mkdir "%%~xa"
		rem Move the file to directory
		move "%%a" "%%~dpa%%~xa\\"
	)
)
```

In a batch file the contents are displayed to the console. We have turned this off with the @echo off command, and what is displayed to the console is what is sent with the ECHO command.

First the batch script will loop through all the file files and assign the file the %%a variable, then check if a directory exists with its extension. If the folder does not exist, it'll create one and finally move the file to that new folder.

The move command will output "1 file(s) moved". and does not tell us which ones by name. We could update this by adding the following line before the move command.

```shell
echo moving %%a to %%~xa
```

This will add a line as such

![](http://usefulscripting.network/wp-content/uploads/2020/02/image.png)

Python File Automation
----------------------

The Python method is a good option for cross operating systems. We will use the OS and SHUTIL modules to get this accomplished.

For the overview we change Python's path to the current directory and list all the files only and add to an array.

```python
# For listing files from the folder. 

l = [f for f in os.listdir(cwd) if os.path.isfile(f)]  
# remove current file from list 
l.remove(os.path.basename(__file__))
l2 = [] 

# Get the extension of file from list l. 

for  value in l: 
    filename, file_extention = os.path.splitext(value)
    l2.append(file_extention)
    #s = value.split('.')[1]  
    #l2.append(s) 
```

Then we split the extension and add this to a new list. With the new list we check if the folder path exists for that extension and if not, create the folder. Once folders are made, we begin to move files with '''shutil'''.

```python
# We remove duplicate values from  
# list l2 and checks if directory  
# exists otherwise we create new one 

for extension in set(l2): 
    dirname = extension  
    if os.path.exists(f'{cwd}\{extension}'): 
        pass
    else: 
        os.makedirs(dirname) 

# We use zip function and list l and 
# l2 passed as arguments. 
# If extension in file is same and 
# file not exists then we move the file. 

for files, extension in zip(l, l2): 
    if extension in files: 
        if os.path.exists(os.path.join(cwd, extension, files)): 
            # skip if file already exists in folder 
            pass
        else:
            # Move files to the extention folder
            shutil.move(os.path.join(cwd, files), os.path.join(cwd, extension)) 
        #print(extension, files)
    else : 
        print('error') 
```

Once all complete we count the frequency of each extension and print "X files were moved to XFolder".

```python
def CountFrequency(my_list): 
    # Creating an empty dictionary  
    freq = {} 
    for item in my_list: 
        if (item in freq): 
            freq[item] += 1
        else: 
            freq[item] = 1

    for key, value in freq.items(): 
        print(f"{value} files were moved to {key}")


CountFrequency(l2)
```

![](http://usefulscripting.network/wp-content/uploads/2020/02/image-2.png)

Output of the fileOrganize.py

This is some good examples on how to manage and automate file organization within folders. you could also setup a simple log and add the log to the move section to notate which files were moved. You could also print the files here as well and use the CountFrequency section for a summary.

View the full source on our [GitHub repo](https://github.com/Useful-Scripting-Network/Python/blob/master/fileOrganize.py).

View our [PowerShell version](http://usefulscripting.network/featured/powershell-sorting-files/) as well!