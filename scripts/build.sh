#!/bin/sh
#

export GOOS=windows
export GOARCH=amd64

cd $(dirname $0)

go build \
	-ldflags "-H windowsgui" -o update.exe update.go
