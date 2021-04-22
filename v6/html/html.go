package html

import (
	"embed"
	"io"
	"log"
)

//go:embed *
var files embed.FS

var (
	amadeusIndexTmpl = parse("amadeus", "index.html")
)

type IndexParams struct {
	User string
}

func Index(w io.Writer, p IndexParams) error {
	log.Println(files)
	return amadeusIndexTmpl.Execute(w, p)
}
