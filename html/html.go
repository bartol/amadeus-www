package html

import (
	"embed"
	"io"
)

//go:embed *
var files embed.FS

var (
	indexTmpl = tmplParse("index.html")
)

type IndexParams struct {
	Message string
}

func Index(w io.Writer, p IndexParams) error {
	return indexTmpl.Execute(w, p)
}
