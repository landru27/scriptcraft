#!/bin/bash


if [[ -f /opt/spigot/DONOTRESTART ]]; then
    echo "================================================="
    echo "'/opt/spigot/DONOTRESTART' exists : NOT starting!"
    echo "================================================="
    exit
fi

cd /opt/spigot
screen -S scmcsrvr -d -m sh /opt/spigot/orbit.sh
