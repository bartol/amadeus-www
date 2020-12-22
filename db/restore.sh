#!/bin/sh

PGDUMP=${PGDUMP:-$(aws s3 ls amadeus-pgdump | awk '{print $4}' | sort | tail -n 1)}
aws s3 cp s3://amadeus-pgdump/$PGDUMP - | pg_restore $@ -d amadeus -c
