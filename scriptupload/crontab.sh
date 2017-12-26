#!/bin/bash

ps aux | grep 'node scriptupload.js' | grep -v grep > /dev/null 2>&1
if [[ $? -ne 1 ]]; then
    exit 0
fi

DATETIME=`date '+%F_%T'`
echo "$DATETIME : starting scriptupload.js from crontab script" \
  >>                    /opt/spigot/scriptupload/crontab.log

cd                      /opt/spigot/scriptupload
node scriptupload.js >> /opt/spigot/scriptupload/crontab.log
