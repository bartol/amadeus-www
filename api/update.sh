#!/usr/bin/env bash

git push
go build

ssh srv1 << EOF
sudo systemctl stop amadeus2.hr-api.service
cd amadeus-www
git reset --hard HEAD
git pull
EOF

scp api srv1:/home/ubuntu/amadeus-www/api

ssh srv1 << EOF
sudo systemctl start amadeus2.hr-api.service
EOF
