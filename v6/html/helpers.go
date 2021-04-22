package html

import (
	"log"
	"regexp"
	"strings"
	"text/template"
)

func parse(dir string, file string) *template.Template {
	l := dir + "/layout.html"
	f := dir + "/" + file
	log.Println(l, f)
	return template.Must(template.New(l).Funcs(funcs).ParseFS(files, l, f))
}

// template helpers

var funcs = template.FuncMap{
	"kebab": kebab,
}

var kebabRe = regexp.MustCompile("[^a-z0-9]+")

func kebab(s string) string {
	return strings.Trim(kebabRe.ReplaceAllString(strings.ToLower(s), "-"), "-")
}
