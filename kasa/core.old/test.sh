#!/usr/bin/env bash

set -ex

DB_NAME="ak_testing_$RANDOM"

cleanup() {
	psql -U postgres -c "DROP DATABASE $DB_NAME"
}
trap cleanup EXIT

psql -U postgres -c "CREATE DATABASE $DB_NAME"

psql_run() {
	psql -U postgres -d $DB_NAME -c "$1"
}

psql_run "\i ./db/schema.sql"
psql_run "\i ./db/seed.sql"

go test -v -dbconn "postgres://postgres@localhost:5432/$DB_NAME" $@
