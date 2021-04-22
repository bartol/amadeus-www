package main

import "strings"

func extract(s string) string {
	r := strings.Split(strings.TrimSuffix(s, "/"), "/")
	return r[len(r)-1]
}
