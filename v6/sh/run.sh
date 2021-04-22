#!/bin/sh

set -x

file_name=$(mktemp /tmp/bin.XXXXX)
process_name=$(basename $file_name)
script_root=$(dirname $0)

trap cleanup EXIT
cleanup() {
	kill $(pidof $process_name)
	rm $file_name
}

export PORT=8080

go build -o $file_name && $file_name &
while inotifywait -rqe MODIFY --exclude "\.*~|\.swp" .; do
	go build -o $file_name || continue
	kill $(pidof $process_name)
	$file_name &
done
