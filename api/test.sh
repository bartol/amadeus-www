#!/usr/bin/env bash

RESOURCE="$1"
HASH="$2"
URL="localhost:8080/$RESOURCE"
PREVIEW=$(curl -s "$URL" | cut -c -1000)
RESULT=$(curl -s "$URL" | sha1sum | cut -d' ' -f1)

if [ "$HASH" == "" ]; then
    echo $PREVIEW...
    echo
    echo ./test.sh $RESOURCE $RESULT
    exit 0
fi

if [ "$HASH" == "$RESULT" ]; then
    echo "test: success"
else
    echo "test: failure"
fi