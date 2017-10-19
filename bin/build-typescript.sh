#!/bin/bash

home=`pwd`

function compileProject {
    if [ "$1" != "" ] && [ "$1" != "common" ]
    then
        if [ -d app/${1}/typescript ]
        then
            echo "[+] Compiling ${1}..."
            cd app/${1}/typescript && tsc

            if [ "$?" != "0" ]
            then
                exit 1
            fi

            cd ${home}
        else
            echo "[!] Skipping ${1}: No typescript directory found in app/${1}/..."
        fi
    fi
}


#
# START
#
if [ "$1" != "" ]
then
    compileProject $1
fi

if [ "$1" == "" ]
then
    for p in `ls app`
    do
        compileProject ${p}
    done
fi

echo "[+] Typescript successfully compiled!"
exit 0