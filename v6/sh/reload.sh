#!/bin/sh

file_name=$(mktemp /tmp/bin.XXXXX)
process_name=$(basename $file_name)

trap cleanup EXIT
cleanup() {
	kill $(pidof $process_name)
	rm $file_name
}

while inotifywait -rqe MODIFY --exclude "\.*~|\.swp" .; do
	go build -o $file_name || continue
	kill $(pidof $process_name)
	$file_name &
	# todo: reload browser tab
done
