package main

import (
	"errors"
	"strconv"
	"strings"
)

func extractID(path string) (int, error) {
	path_split := strings.Split(path, "/")
	subpath := path_split[len(path_split)-1]
	subpath_split := strings.Split(subpath, "-")
	ID, err := strconv.Atoi(subpath_split[0])
	if err != nil {
		return 0, errors.New("failed to extract ID")
	}
	return ID, nil
}
