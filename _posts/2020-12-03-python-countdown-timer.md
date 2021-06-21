---
title: 'Python Countdown Timer'
date: Tue, 03 Dec 2019 20:37:43 +0000
categories: Python
tags: ['Python']
classes: wide
author: Clayton Errington
---

Creating a timer is something we can use with just about projects. Whether that is to sleep the script or create a timer to perform something else. We will use two python modules: time and click.

First, lets create our countdown function.

```python
def countdown(n):
    while n > 0:
        # Clear the screen
        click.clear()
        # print the number in the countdown
        print(n)
        # Pause the script for 1 second 
        time.sleep(1)
        # subtract 1 from the count
        n -= 1
        if n == 0:
            # Once n is 0, print a message or call a function
            click.clear()
            print('times up!')
```

Python's [Click](https://click.palletsprojects.com/en/7.x/) module will allow us to use the clear() function across multiple operating systems rather than the OS module and calling os.system('cls') or os.system('clear') and have to parse our system.

So that is great we can call this at any time and use countdown(30) to create a 30 second timer. But what if we want to change it up when we call the countdown file? Lets add some arguments.

```python
if __name__ == "__main__":
    # If script is called directly, lets ask for some arguments - count
    import argparse
    parser = argparse.ArgumentParser(description="Simple Countdown app")
    parser.add\_argument("count", type=int, help="Time to countdown")
    
    args = parser.parse_args()
    
    # Set a variable to our argument
    count = args.count
    
    # Call our function
    countdown(count)
```

Once done we can save our script and run it with Python, and see our countdown start running.

```shell
Python countdown.py 30
```

Argparse adds a simple --help menu for use to use as well. Instead of our time, use --help and see the result.

```shell
usage: countdown.py [-h] count

Simple Countdown app

positional arguments:
  count       Time to countdown

optional arguments:
  -h, --help  show this help message and exit
```

There are endless opportunities with this concept, feel free to explore.

View the full code on our [Github](https://github.com/Useful-Scripting-Network/Python/blob/master/countdown.py) repo.