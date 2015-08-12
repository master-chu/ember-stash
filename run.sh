#!/bin/bash
login=0

while getopts l opt
  do
    case "$opt" in
      l)  login=1;;
      \?) echo "  Usage: $0 [-l]"
          echo "  -l forces new stash user login"
          exit 1;;
    esac
  done
shift `expr $OPTIND - 1`

authstring="./auth_string.txt"
if [ "$login" == "1" ] && [ -e  "$authstring" ]
then
    echo "Forcing login with new user."
    rm auth_string.txt
fi

node server.js