#!/bin/sh

mkdir -p ../templates/info/
for file in $(find . -name "*.md"); do
    file_out=../templates/info/${file%.md}.html
    pandoc $file -o $file_out
    echo $file_out
done
