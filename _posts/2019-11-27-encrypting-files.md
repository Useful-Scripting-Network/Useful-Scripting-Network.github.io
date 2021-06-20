---
title: 'Encrypting Files'
date: Wed, 27 Nov 2019 21:08:03 +0000
draft: false
categories: Python
tags: ['Python', 'Security']
layout: single
classes: wide
---

With python there are many modules to use for encryption. Today we will see how to generate a key and encrypt a file. Encryption is used when encoding a file in a way that only the authorized people can decrypt it to access the data.

We will take a look at how we can encrypt files using Python using the [cryptography](https://cryptography.io/en/latest) module.

To begin, we will need to install cryptography

```
pip install cryptography
```

Now start a new filecrypt.py file and start with

```
from cryptography.fernet import Fernet
import os
```

Generating a key
----------------

```
def write_key():
    """
    Generates a key and save it into a file
    """
    key = Fernet.generate_key()
    with open("key.key", "wb") as key_file:
        key_file.write(key)
```

Fernet is a symmetric encryption method that ensures your encrypted message cannot be read or manipulated without the key. The generate.key() function will create a new fernet key to use. Make sure to keep this key, or your encrypted file will not be able to be decrpyted later.

Next we need to load the key so we can use it in our encryption method. Since this key is saved as key.key we can reuse this same key for multiple projects if wanted.

```
def load_key():
    """
    Loads the key from the current directory named `key.key`
    """
    return open("key.key", "rb").read()
```

To start the encryption method we need to generate a Fernet object and read the file into Python.

```
def encrypt(filename, key):
    """
    Given a filename (str) and key (bytes), it encrypts the file and write it
    """
    f = Fernet(key)
    with open(filename, "rb") as file:
        # read all file data
        file_data = file.read()
```

Next we begin encrypting the data and write the file. This will overwrite the data in the original file, so be careful when using this on important information. At the end we have renamed the file to add .enc to it so we know the file is encrypted.

```
    # encrypt data
    encrypted_data = f.encrypt(file_data)
    # write the encrypted file
    with open(filename, "wb") as file:
        file.write(encrypted_data)
    
    # rename file with enc extention
    os.rename(filename, filename+".enc")
```

Now that we have encrypted our file, we will need to be able to decrypt it. We start the same process of creating our Fernet object, opening our encrypted file, the passing the decrypt command, and writing the decrypted bytes back to our file.

```
def decrypt(filename, key):
    """
    Given a filename (str) and key (bytes), it decrypts the file and write it
    """
    f = Fernet(key)
    with open(filename, "rb") as file:
        # read the encrypted data
        encrypted_data = file.read()
    # decrypt data
    decrypted_data = f.decrypt(encrypted_data)
    # write the original file
    with open(filename, "wb") as file:
        file.write(decrypted_data)
    
    # rename file to remove enc extention
    os.rename(filename, filename.replace(".enc", ""))
```

Now try to run our script by opening your Python terminal and launching our file. In our full code we have added some arguments to generate our key and encrypt and decrypt our file.

```
python filecrypt.py -e test.txt
python filecrypt.py -d test.txt.enc
```

View the full source code on our [GitHub](https://github.com/Useful-Scripting-Network/Python/tree/master/filecrypt) account.