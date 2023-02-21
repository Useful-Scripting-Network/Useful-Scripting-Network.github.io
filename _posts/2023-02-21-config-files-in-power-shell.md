---
title: Config Files In PowerShell
date: 2023-02-21T15:16:18.071Z
template: "post"
category: PowerShell
excerpt: Explaining how to use config files in PowerShell for more complex scripts
classes: wide
author: Tom Yates
---

Sometimes on larger and more complex scripts, the use of parameters doesn't quite 'cut the mustard', and you need something a little more robust. JSON (JavaScript Object Notation) files are ideal for storing configuration beyond the normal runtime parameters, and still allow easy administration for those running your scripts. 

Firstly, create your JSON config file. Below is an simple extract from a JSON file used in one of my real script which automatically uploaded files to an Azure Storage Account and then did some image manipulation with a Virtual Machine. *(The purpose is not important, we just need some configuration data to work with!)*

```json
{
    "Container": "test-container-123",
    "ShutdownVMAfterComplete":true,
    "StorageAccount":"teststorageaccount"
}
```

Save the JSON file in the same folder as your script, or do as I do - and store your config files in a child folder off the root location where your script is: 

```
D:.
| read-config.ps1
\---config
        config.json
```

Now, read your config file into a variable:

```powershell
$Config = Get-Content ./config/config.json
```

If we look at `$Config` through the eyes of the Get-Member cmdlet, (`$Config | Get-Member`) we can see that it's read it as a string. 

![config parameter piped into get-member cmdlet](/assets/config-gm.png)

That is no good! We need to read it as JSON. Luckily, theres a cmdlet for that: 

```powershell
$Config = Get-Content ./config/config.json | ConvertFrom-Json
```

The ConvertFrom-JSON cmdlet has done all the hard work for us, and converted the entire JSON file into an object that we can read with ease:

![config object](/assets/config-correct.png)

Looking at our config file, we stored a parameter called 'container' which states which storage container our ficticious script needs to access. To read the 'container' parameter from the config object its as simple as using dot notation: 

![config container](/assets/config-container.png)

That's just a string, so we can now do whatever we want with it.. perhaps we'll put it in a message for the user. As we are now embedding a property of `$config` within a string, its really important to encapulate it with `$()`. 

For Example: `$($config.container)`

```powershell
write-output "Uploading some files to $($config.container)..."
```

But what about the 'ShutdownVMAfterComplete' which is a boolean value? Easy.. you may do something like this...

```powershell
If($($config.ShutdownVMAfterComplete)){
    Write-Output "VM Shutdown is configured as 'true'. Shutting down the VM..."
    # Some logic to shut down virtual machine here...
}
```

Well thats great and all, but what if you want to nest some of my configuration items together, to make full power of JSON? No problem, see this example which has a number of items stored under the "Azure" key. 

```json
{
    "Container": "test-container-123",
    "ShutdownVMAfterComplete":true,
    "Azure":{
        "StorageAccount":"myteststorageaccount",
        "StorageResourceGroup":"myResourceGroup",
        "StorageType":"file",
        "LogLevel":"WARNING"
    }
}
```

Looking at the `$config` object after its been converted using the `ConvertFrom-JSON` cmdlet shows the additional config properties under a parent column:

![config expanded](/assets/config-expanded.png)

Now we call the new Azure items exactly as before:
```powershell
Write-Output $config.Azure.StorageAccount
```

And it's as easy as that, although you may want to put some error handling in for reading the config file, for example if it doesn't exist or cannot read it. This method creates a really easy way to store additional configuration items for your scripts. In a future post we'll demonstrate how to write back to the config json file. 
