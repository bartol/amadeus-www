#!/bin/sh

file_name=$(mktemp /tmp/bin.XXXXX)
process_name=$(basename $file_name)

trap cleanup EXIT
cleanup() {
	trap - EXIT
	kill $(pidof $process_name)
	rm $file_name
}

./loadenv.sh
go build -o $file_name && $file_name &
xdg-open http://localhost:$PORT
while inotifywait -rqe MODIFY --exclude "\.*~|\.swp" .; do
	go build -o $file_name || continue
	kill $(pidof $process_name)
	$file_name &
done
