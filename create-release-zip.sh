#!/bin/sh

mkdir release-$1
mkdir release-$1/build
cp index.html release-$1/
cp build/index.js release-$1/build
zip -r release-$1.zip release-$1/
