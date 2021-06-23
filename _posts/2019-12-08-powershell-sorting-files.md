---
title: 'Powershell: Sorting Files'
date: Tue, 15 Sep 2020 20:48:44 +0000
categories: Powershell
tags: ['Automation']
classes: wide
author: Clayton Errington
---

In a previous post I talked about how to use [Python to organize files](http://usefulscripting.network/computers/windows/automate-file-organizing/). Since most of my work is on a windows machine I thought I would add a Powershell based file organizer to my [Profile](http://usefulscripting.network/computers/windows/how-to-create-a-powershell-profile/). Lets begin!

We will look at a few modules for Powershell and how to use them together to get our organization accomplished. Just like in the previous post we'll organize a directory by file extension and not by file types. So for all the extensions we have in a folder we'll create folders for them and move all files to the appropriate folder of their extension.

The following modules are the basis of what we are going to use in our function.

```powershell
Get-ChildItem
Move-Item
```

`Get-ChildItem` is the equivilent to the `ls` command in Linux systems or `dir` in the Windows Command Prompt. With this we can list the files of a directory. First, lets setup our Function.

```powershell
function Sort-Files {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$false)]
        [string]$cwd = (Get-Location).Path
    )
}
```

We will want to have the option to pass a location to our function in case we need to run the same function multiple times, we wont have to keep changing the directory. Next up, lets get our files and extensions of the directory.

```powershell
# Gather the extensions of the files in the folder path
$extforfolders = Get-ChildItem $cwd -File | Select-Object Extension
# Gather the list of files only
$files = Get-ChildItem $cwd -File
```

When running `Get-ChildItem` we can specify the directory for it to look at by passing the location in the variable $cwd which is set to the path of the script unless otherwise defined. The `-File` switch tells Powershell to only look for files. The command also has properties it displays by default and some hidden ones about the file object. One of these properties is the `Extension` property. The variable `$extforfolders` will hold all the extensions we need. The total files is gathered in the `$files` variable.

For this next part we'll want to create a list and then create the directories for each file extension we found in our directory.

```powershell
# Create a new list to add the extensions to
$extensions = New-Object Collections.Generic.List[String]

Write-Host "Getting files and creating subfolders of extensions if it does not exist..."
foreach($folder in $extforfolders){
   # Use the .NET class to create a directory. If it exits will proceed. If not exists, will create the directory
   [System.IO.Directory]::CreateDirectory("$cwd\\$($folder.Extension)") | Out-Null
   # Add every extension to the list. Will sort later.
   $extensions.Add($folder.Extension)
}
```

It was easier for this use case to bring in .NET and create a list for the extensions as native Powershell has some restrictions. We loop over each folder we need to create from `$extforfolders` and again use .NET to create our directory, then add our folder or file extension to our list of extensions. The .NET class `[System.IO.Directory]::CreateDirectory()` benefits us since in .NET if a folder exists the program moves on, if it needs to be created it does so. This speeds up and shortens our code since we do not need to test if the folder existed. The `Out-Null` hides the output since we don't _need_ to see the creation of the folders.

Now that we have our directories made and extensions known, we can begin moving the files.

```powershell
if($extensions.Count -gt 0){
        foreach($file in $files){
            try {
                Write-Host "Moving $($file) to folder: $cwd\\$($file.Extension)"
                # If File exists or in use ErrorAction Stop so we can catch the error properly
                # Using $file.FullName to get long path of file since script/function may not always be in the same directory as files. 
                Move-Item $file.FullName -Destination "$cwd\\$($file.Extension)" -Force -ErrorAction Stop
            }
            catch { 
                Write-Warning "Failed to move file '$file' to folder '$($file.Extension)'. File either exists in folder or is in use."
            }
        }
        Write-Host "Summary of Sorting Files"
        # Group and count the extentions
        $extensions | Group-Object -NoElement | Sort-Object count -Descending
    }else {
        Write-Host "No files to sort here: $cwd"
    }
```

I wanted to check if our list of extensions had anything and if so, we'd try to move our files for organization. Once all files have been moved we output a list to show the summary of the files we just organized.

![](http://usefulscripting.network/wp-content/uploads/2020/09/image.png)

To run this we can call our functions name and specify the current directory to use or just the function.

`Sort-Files -cwd $env:USERPROFILE\downloads` should do the trick!

You can view the full code on our [Github Repo](https://github.com/Useful-Scripting-Network/Powershell/blob/master/Sort-Files.ps1).