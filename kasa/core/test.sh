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

sed_run() {
	find $1 -type f -name "*.out.golden" -print0 | 
	xargs -0 sed -i "$2"
}

# remove time sensitive data from golden files
sed_run ./testdata/products/ProductCreate "/created_at/d"
sed_run ./testdata/products/ProductCreate "/updated_at/d"
sed_run ./testdata/products/ProductUpdate "/updated_at/d"