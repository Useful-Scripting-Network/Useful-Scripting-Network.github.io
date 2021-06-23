---
title: 'Working with Archive Files'
date: Fri, 20 Mar 2020 23:12:50 +0000
categories: Powershell
tags: ['Windows']
classes: wide
author: Clayton Errington
---

No matter what we do we are always working with archiving files compressing or decompressing them. In this post we are going to take a look at creating a ZIP file with PowerShell at .NET.

We can add these functions to our [PowerShell profile](http://usefulscripting.network/computers/windows/how-to-create-a-powershell-profile/) or within a simple script we can reuse. To begin we will need to add a .NET assembly to the script.

```powershell
Add-Type -As System.IO.Compression.FileSystem
```

We have just added the .NET assembly from the System.IO class and asked for the Compression.FileSystem subclass. This is what will do the heavy lifting later. We will create two functions, one to compress and one to decompress. Each will have their own command-line arguments to help with processing.

```powershell
function New-ZipFile {
	#.Synopsis
	#  Create a new zip file, optionally appending to an existing zip...
	[CmdletBinding()]
	param(
		# The path of the zip to create
		[Parameter(Position=0, Mandatory=$true)]
		$ZipFilePath,

		# Items that we want to add to the ZipFile
		[Parameter(Position=1, Mandatory=$true, ValueFromPipelineByPropertyName=$true)]
		[Alias("PSPath","Item")]
		[string[]]$InputObject = $Pwd,

		# Append to an existing zip file, instead of overwriting it
		[Switch]$Append,

		# The compression level (defaults to Optimal):
		#   Optimal - The compression operation should be optimally compressed, even if the operation takes a longer time to complete.
		#   Fastest - The compression operation should complete as quickly as possible, even if the resulting file is not optimally compressed.
		#   NoCompression - No compression should be performed on the file.
		[System.IO.Compression.CompressionLevel]$Compression = "Optimal"
	)
	begin {
		# Make sure the folder already exists
		[string]$File = Split-Path $ZipFilePath -Leaf
		[string]$Folder = $(if($Folder = Split-Path $ZipFilePath) { Resolve-Path $Folder } else { $Pwd })
		$ZipFilePath = Join-Path $Folder $File
		# If they don't want to append, make sure the zip file doesn't already exist.
		if(!$Append) {
			if(Test-Path $ZipFilePath) { Remove-Item $ZipFilePath }
		}
		$Archive = [System.IO.Compression.ZipFile]::Open( $ZipFilePath, "Update" )
	}
	process {
		foreach($path in $InputObject) {
			foreach($item in Resolve-Path $path) {
				# Push-Location so we can use Resolve-Path -Relative
				Push-Location (Split-Path $item)
				# This will get the file, or all the files in the folder (recursively)
				foreach($file in Get-ChildItem $item -Recurse -File -Force | % FullName) {
					# Calculate the relative file path
					$relative = (Resolve-Path $file -Relative).TrimStart(".\")
					# Add the file to the zip
					$null = [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($Archive, $file, $relative, $Compression)
				}
				Pop-Location
			}
		}
	}
	end {
		$Archive.Dispose()
		Get-Item $ZipFilePath
	}
}
```

We begin by setting the variables needed such as the compressed file path, the folder we want to compress, the append to an existing file, and the compression level. In the begin statement we create the zip file and setup the system to start adding the files once we are in the process block.

In the process block we take each item in the path and add it to the filestream to create the zip file.

Once the process is complete we close the archive file stram and then list the contents of the file to the console to show it is complete.

Along with compressing files, we also need to decompress files so lets begin to make the decompress function. Since we are in the same script file we do not need to reimport the .NET module.

```powershell
function Expand-ZipFile {
	#.Synopsis
	#  Expand a zip file, ensuring it's contents go to a single folder ...
	[CmdletBinding()]
	param(
		# The path of the zip file that needs to be extracted
		[Parameter(ValueFromPipelineByPropertyName=$true, Position=0, Mandatory=$true)]
		[Alias("PSPath")]
		$FilePath,

		# The path where we want the output folder to end up
		[Parameter(Position=1)]
		$OutputPath = $Pwd,

		# Make sure the resulting folder is always named the same as the archive
		[Switch]$Force
	)
	process {
		$ZipFile = Get-Item $FilePath
		$Archive = [System.IO.Compression.ZipFile]::Open( $ZipFile, "Read" )

		# Figure out where we'd prefer to end up
		if(Test-Path $OutputPath) {
			# If they pass a path that exists, we want to create a new folder
			$Destination = Join-Path $OutputPath $ZipFile.BaseName
		} else {
			# Otherwise, since they passed a folder, they must want us to use it
			$Destination = $OutputPath
		}

		# The root folder of the first entry ...
		$ArchiveRoot = ($Archive.Entries[0].FullName -Split "/|\\")[0]

		Write-Verbose "Desired Destination: $Destination"
		Write-Verbose "Archive Root: $ArchiveRoot"

		# If any of the files are not in the same root folder ...
		if($Archive.Entries.FullName | Where-Object { @($_ -Split "/|\\")[0] -ne $ArchiveRoot }) {
			# extract it into a new folder:
			New-Item $Destination -Type Directory -Force
			[System.IO.Compression.ZipFileExtensions]::ExtractToDirectory( $Archive, $Destination )
		} else {
			# otherwise, extract it to the OutputPath
			[System.IO.Compression.ZipFileExtensions]::ExtractToDirectory( $Archive, $OutputPath )

			# If there was only a single file in the archive, then we'll just output that file...
			if($Archive.Entries.Count -eq 1) {
				# Except, if they asked for an OutputPath with an extension on it, we'll rename the file to that ...
				if([System.IO.Path]::GetExtension($Destination)) {
					Move-Item (Join-Path $OutputPath $Archive.Entries[0].FullName) $Destination
				} else {
					Get-Item (Join-Path $OutputPath $Archive.Entries[0].FullName)
				}
			} elseif($Force) {
				# Otherwise let's make sure that we move it to where we expect it to go, in case the zip's been renamed
				if($ArchiveRoot -ne $ZipFile.BaseName) {
					Move-Item (join-path $OutputPath $ArchiveRoot) $Destination
					Get-Item $Destination
				}
			} else {
				Get-Item (Join-Path $OutputPath $ArchiveRoot)
			}
		}

		$Archive.Dispose()
	}
}
```

With this function we can also provide arguments such as the archive file. the default location is the current working directory.

We begin by opening the file with the .NET assembly in Read mode, then create a folder for the archived items to be extracted to. It will loop over each type of file or folder and create the child folders if the file is not in the archive root.

To make these functions easier to use we can create aliases for them.

```powershell
# Add the aliases ZIP and UNZIP
new-alias zip new-zipfile

new-alias unzip expand-zipfile
```

Now that the aliases are in place we can simply call zip or unzip respectfully. The process does not show any progress so if you have a large folder you may only have the flashing cursor to let you know something is working.

Usage of the functions is as follows:

```powershell
zip .\filename.zip C:\files\folder-to-zip

unzip .\filename.zip
```

You can find the full script on our [GitHub page](https://github.com/Useful-Scripting-Network/Powershell/blob/master/zipping.ps1).