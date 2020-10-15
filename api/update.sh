#!/usr/bin/env bash

go build
scp api srv1:/home/ubuntu/amadeus-www/api

ssh srv1 << EOF
cd amadeus-www
git pull
sudo systemctl restart amadeus2.hr-api.service
EOF
