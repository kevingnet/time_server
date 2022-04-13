#!/bin/bash

###. ~/.nvm/nvm.sh
###nvm install node

DIR="/home/ec2-user/time_server"
if [ -d "$DIR" ]; then
  echo "$DIR exists"
else
  echo "Creating $DIR directory"
  mkdir $DIR
fi