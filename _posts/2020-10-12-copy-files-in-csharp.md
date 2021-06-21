---
title: 'Copy Files in C#'
date: Mon, 12 Oct 2020 18:48:30 +0000
categories: Computers
tags: ['C#', 'Windows']
layout: single
classes: wide
classes: wide
author: Clayton Errington
---

There are about 100 different ways to copy files on a computer system. Various scripts already have builtin ways like Windows default `copy` or `Copy-Item` in Powershell.

For a certain project we needed to copy files from one server to another and already built a C#/WPF application for the UI. I needed to be able to copy an entire folder to a new server and created the following console application.

To begin we only need to use two assemblies, `System` and `System.IO` to get the `DirectoryInfo` and `FileInfo` classes. For this simple application I wanted to add some command line arguments so we add `string[] args` to our Main function.

```csharp
static void Main(string[] args)
        {
            if(args.Length == 0)
            {
                Console.WriteLine("");
                Console.WriteLine("     Please specify the source directory and destination directory");
                Console.WriteLine("     CopyFiles.exe source_dir dest_dir");
                Console.WriteLine("");
            }
            else {
                // Copy from the current directory, include subdirectories.
                DirectoryCopy(args[0], args[1], true);
            }
        }
```

If we do not have any arguments we give an example of how to use our CopyFiles program. Once we have arguments we call our internal `DirectoryCopy` function and specify our values. Let's begin our copy function.

```csharp
private static void DirectoryCopy(string sourceDirName, string destDirName, bool copySubDirs)
        {}
```

When we start we want to see if our source directory exists. We do this by creating a variable, `dir` and creating a `DirectoryInfo` object with it. We can then use this to verify the source directory and the sub contents. If the source directory does not exist we can `throw` the error to stop the program and report the error. Once the verify the source directory we want to check the destination and create the destination directory if it does not exist.

```csharp
// Get the subdirectories for the specified directory.
DirectoryInfo dir = new DirectoryInfo(sourceDirName);

if (!dir.Exists)
{
     throw new DirectoryNotFoundException(
          "Source directory does not exist or could not be found: "
          + sourceDirName);
}

DirectoryInfo[] dirs = dir.GetDirectories();
// If the destination directory doesn't exist, create it.
if (!Directory.Exists(destDirName))
{
     Directory.CreateDirectory(destDirName);
}
```

Now that we have verified the source and destination directories we can begin creating the `FileInfo` object to copy the files.

```csharp
// Get the files in the directory and copy them to the new location.
FileInfo[] files = dir.GetFiles();
    foreach (FileInfo file in files)
    {
        string temppath = Path.Combine(destDirName, file.Name);
        // true overwrites the files.
        file.CopyTo(temppath, true);
        Console.WriteLine(temppath);
    }
```

If you were to stop here you'd find out that we'd only copy the parent directory and not the sub contents. on our parent function there is a bool for copySubDirs. Lets add a quick if statement to check this and continue.

```csharp
 // If copying subdirectories, copy them and their contents to new location.
    if (copySubDirs)
    {
        foreach (DirectoryInfo subdir in dirs)
        {
            string temppath = Path.Combine(destDirName, subdir.Name);
            DirectoryCopy(subdir.FullName, temppath, copySubDirs);
        }
    }
```

This part adds some fun recursion to our program because each sub directory recalls the `DirectoryCopy()` function until there are no more sub directories.

Once you are done we will want to ensure our project has the right framework set for the .NET runtime. I suggest using the latest release group and have set the project down to .NET 4.5.1 as the lowest supported framework version. Most machines should already have this requirement met. For now I believe this is a good average version to set this simple file copy program to.

Now we need to compile the C# file to an application and make it an executable. In Visual Studios, just choose Build and then Build Solution. Find your new EXE and you can take this where ever you'd like.

To use this we'd need to be in a Command or Powershell Prompt and call CopyFiles.exe source_dir dest_dir

```shell
CopyFiles.exe E:\temp E:\new
```

Find our full script on our [GitHub page](https://github.com/Useful-Scripting-Network/CSharp/blob/main/CopyFiles.cs). Next will be how we made a GUI window for our copy function where we can select the source and destination directories.