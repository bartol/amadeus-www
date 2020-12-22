#!/bin/sh

pg_dump -Fc $@ amadeus | aws s3 cp - s3://amadeus-pgdump/$(date +"%Y-%m-%d_%H-%M-%S").pgdump
