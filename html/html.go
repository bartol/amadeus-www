package html

import (
	"embed"
	"io"

	"github.com/bdeak4/amadeus2.hr/data"
)

//go:embed *
var files embed.FS

var (
	indexTmpl    = tmplParse("index.html")
	productTmpl  = tmplParse("product.html")
	categoryTmpl = tmplParse("category.html")
)

type IndexParams struct {
}

func Index(w io.Writer, p IndexParams) error {
	return indexTmpl.Execute(w, p)
}

type ProductParams struct {
	Product data.Product
}

func Product(w io.Writer, p ProductParams) error {
	return productTmpl.Execute(w, p)
}

type CategoryParams struct {
	Category data.Category
	Products []data.Product
}

func Category(w io.Writer, p CategoryParams) error {
	return categoryTmpl.Execute(w, p)
}
