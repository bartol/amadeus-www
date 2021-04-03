package html

import (
	"embed"
	"html/template"
	"io"
	"strings"
)

//go:embed *
var files embed.FS

var (
	indexTmpl = parse("index.html")
)

type IndexParams struct {
	User string
}

func Index(w io.Writer, p IndexParams) error {
	return indexTmpl.Execute(w, p)
}

var funcs = template.FuncMap{
	"uppercase": func(v string) string {
		return strings.ToUpper(v)
	},
}

func parse(file string) *template.Template {
	return template.Must(template.New("layout.html").Funcs(funcs).ParseFS(files, "layout.html", file))
}
