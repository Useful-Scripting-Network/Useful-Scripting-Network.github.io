---
title: 'Scheduling file backups with Python'
date: Sun, 19 Jan 2020 21:15:03 +0000
categories: Python
tags: ['Python', 'Automation']
classes: wide
author: Clayton Errington
---

No matter what industry and position you are in, there are always file you need to backup. With so many options out there, creating your own solution is sometimes all you need. In this example we will utilize Python's dustutils and schedule module.

The concept I wanted to setup was a copy system that would copy only new and changed files to our remote location, not the whole directory each time. With distutils we can define our copy tree function to update the directory with only the newer files.

This is great, but next we want to make sure this runs on a timely manner not just once or twice when I remember to run the script. This is where the schedule module comes in. We can create a schedule to run at the top of the hour or at anytime, or segment we'd like.

Lets begin!

```python
import distutils.log
import distutils.dir_util
import schedule, time, click

src_dir = "C:\scripts"
dst_dir = "D:\backups\scripts"
```

Now we have our imports and our source and destination defined. Lets create our job to copy the files.

```python
def job():
    # Click's clear function is OS independent way to clear the console
    click.clear()
    # Display message of what we are copying.
    print(f'Copying {src_dir} to {dst_dir}')

    distutils.log.set_verbosity(distutils.log.DEBUG)
    distutils.dir_util.copy_tree(
        src_dir,
        dst_dir,
        update=1,
        verbose=1,
    )
    # Once done, let's tell our user.
    print(f'Done... Waiting to start again at the top of the hour...')
```

Now we need to setup the schedule .

```python
#set schedule
schedule.every().hour.at(":00").do(job)

#start upon launch, cause we'd want to start a copy and not wait until the scheduled time
job()
```

In order to run the scheduled task, we need to set a loop to run the pending tasks.

```python
#run schedules
while True:
    schedule.run_pending()
    time.sleep(1)
```

Once we save this we can now have a scheduled task that will copy the source directories to the destination directories. If you have several individual folders we can set multiple schedules.

If we specify schedule.every().hour().do(job), Our run all pending tasks will start an hour from the time we launched the script. This is why I specified a time in the hour, and ran the job once the script is executed.

View full script on our [GitHub repo](https://github.com/Useful-Scripting-Network/Python/blob/master/fileBackup.py).