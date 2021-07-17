package html

import (
	"html/template"
	"regexp"
	"strings"
)

func tmplParse(file string) *template.Template {
	return template.Must(
		template.New("layout.html").
			Funcs(funcs).
			ParseFS(files, "layout.html", file),
	)
}

// template helpers

var funcs = template.FuncMap{
	"kebab": kebab,
}

var kebabRe = regexp.MustCompile("[^a-z0-9]+")

func kebab(s string) string {
	return strings.Trim(kebabRe.ReplaceAllString(strings.ToLower(s), "-"), "-")
}
