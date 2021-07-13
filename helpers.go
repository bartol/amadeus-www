package main

import (
	"strings"
)

func extractSlug(path string) string {
	wo_trailing := strings.TrimSuffix(path, "/")
	s := strings.Split(wo_trailing, "/")
	return s[len(s)-1]
}
