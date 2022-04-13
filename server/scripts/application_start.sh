#!/bin/bash

cd /home/ec2-user/time_server

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

npm install

node app.sh > app.out.log 2> app.err.log < /dev/null &
