#!/bin/sh

set -ex

SEED=$(tr -cd 0-9 </dev/urandom | head -c 4)
DB_NAME="ak_testing_$SEED"
LOG_FILE="/tmp/amadeus-kasa/core.log"
CONFIG_FILE="/tmp/amadeus-kasa/core.toml"

cleanup() {
	psql -U postgres -c "DROP DATABASE $DB_NAME"
	rm $CONFIG_FILE
}
trap cleanup EXIT

# create database
psql -U postgres -c "CREATE DATABASE $DB_NAME"
psql -U postgres -d $DB_NAME -c "\i ./db/schema.sql"
psql -U postgres -d $DB_NAME -c "\i ./db/seed.sql"

# create config
mkdir -p $(dirname $CONFIG_FILE)
cp test.toml $CONFIG_FILE
sed -i "s/DB_NAME/$DB_NAME/" $CONFIG_FILE
sed -i "s|LOG_FILE|$LOG_FILE|" $CONFIG_FILE

# run tests
go test -v -config $CONFIG_FILE $@
