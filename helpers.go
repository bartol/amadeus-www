package main

import (
	"encoding/json"
	"fmt"
	"strings"
)

func extractSlug(path string) string {
	wo_trailing := strings.TrimSuffix(path, "/")
	s := strings.Split(wo_trailing, "/")
	return s[len(s)-1]
}

func pp(d interface{}) {
	s, _ := json.MarshalIndent(d, "", "\t")
	fmt.Print(string(s))
}
