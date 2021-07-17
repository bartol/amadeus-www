#!/bin/sh

bin=$(mktemp /tmp/bin.XXXXX)
process=$(basename $bin)

cleanup() {
	pidof -q $process && kill $(pidof $process)
	test -f $bin && rm $bin
}
trap cleanup EXIT INT HUP

while inotifywait -rqe MODIFY --exclude "\.swp" @./.git .; do
	go build --tags "fts5" -o $bin || continue
	pidof -q $process && kill -9 $(pidof $process)
	$bin &
done
