package data

import (
	"errors"
	"fmt"
)

func (db *DB) ProductCheck(slug string) bool {
	var n int

	err := db.Get(&n, `
	SELECT
		1
	FROM
		products
	WHERE
		slug = ?
	;`, slug)
	if err != nil {
		return false
	}

	return true
}

func (db *DB) ProductGet(slug string) (Product, error) {
	var p Product

	err := db.Get(&p, `
	SELECT
		rowid, name, description, quantity, video, slug
	FROM
		products
	WHERE
		slug = ?
	;`, slug)
	if err != nil {
		return Product{}, err
	}

	err = db.Select(&p.Prices, `
	SELECT
		type, amount, minquantity
	FROM
		product_prices
	WHERE
		productid = ?
	;`, p.RowID)
	if err != nil {
		return Product{}, err
	}

	err = db.Select(&p.Categories, `
	SELECT
		name, slug
	FROM
		product_categories AS pc
		JOIN categories AS c ON pc.categoryid = c.rowid
	WHERE
		productid = ?
	;`, p.RowID)
	if err != nil {
		return Product{}, err
	}

	err = db.Select(&p.Images, `
	SELECT
		url
	FROM
		product_images
	WHERE
		productid = ?
	ORDER BY
		position ASC
	;`, p.RowID)
	if err != nil {
		return Product{}, err
	}

	err = db.Select(&p.Features, `
	SELECT
		key, value
	FROM
		product_features
	WHERE
		productid = ?
	ORDER BY
		position ASC
	;`, p.RowID)
	if err != nil {
		return Product{}, err
	}

	return p, nil
}

func (db *DB) ProductList(filters map[string]string) ([]Product, error) {
	var products []Product

	if len(filters) == 0 {
		err := errors.New("No filters defined")
		return []Product{}, err
	}

	var fromsql string
	var wheresql string
	var args []interface{}

	// filters: query, feature, sort, page, price_min, price_max, price_type

	if val, ok := filters["category_slug"]; ok {
		wheresql = wheresql + `? IN (
			SELECT
				slug
			FROM
				product_categories AS pc
				JOIN categories AS c ON pc.categoryid = c.rowid
			WHERE
				productid = p.rowid
		)`
		args = append(args, val)
	}

	q := `
	SELECT
		rowid, name, quantity, slug
	FROM
		products AS p
		` + fromsql + `
	WHERE
		` + wheresql + `
	;`

	fmt.Println(q)

	err := db.Select(&products, q, args...)
	if err != nil {
		return []Product{}, err
	}

	pp(products)

	return products, nil
}
