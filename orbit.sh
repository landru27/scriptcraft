#!/bin/bash


while [[ 1 ]]; do
    if [[ -f /opt/spigot/DONOTRESTART ]]; then
        echo "================================================="
        echo "'/opt/spigot/DONOTRESTART' exists : NOT starting!"
        echo "================================================="
        exit
    fi

    cd /opt/spigot
    java -Xms1G -Xmx1G -XX:+UseConcMarkSweepGC -jar spigot-1.12.2.jar

    sleep 4
    sync
    sync
    sync
    sleep 4
done
