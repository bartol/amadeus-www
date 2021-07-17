package data

import (
	"encoding/json"
	"errors"
	"strconv"
	"strings"
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
	err = db.foreignFieldsGet(&p)
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
	var wheresql []string
	var args []interface{}
	if val, ok := filters["query"]; ok {
		query := strings.Replace(val, " ", "* ", -1) + "*"
		wheresql = append(wheresql, `idx MATCH ?`)
		args = append(args, query)
	}
	if val, ok := filters["category_slug"]; ok {
		wheresql = append(wheresql, `? IN (
			SELECT
				slug
			FROM
				product_categories AS pc
				JOIN categories AS c ON pc.categoryid = c.rowid
			WHERE
				productid = p.rowid
		)`)
		args = append(args, val)
	}
	if val, ok := filters["features"]; ok {
		var features []map[string]string
		err := json.Unmarshal([]byte(val), &features)
		if err != nil {
			return []Product{}, err
		}
		for _, f := range features {
			for k, v := range f {
				wheresql = append(wheresql, `(
					SELECT
						value
					FROM
						product_features
					WHERE
						productid = p.rowid
						AND key = ?
				) = ?`)
				args = append(args, k)
				args = append(args, v)
			}
		}
	}
	if type_, ok := filters["price_type"]; ok {
		if val, ok := filters["price_min"]; ok {
			wheresql = append(wheresql, `(
				SELECT
					amount
				FROM
					product_prices
				WHERE
					productid = p.rowid
					AND type = ?
			) > ?`)
			args = append(args, type_)
			args = append(args, val)
		}
		if val, ok := filters["price_max"]; ok {
			wheresql = append(wheresql, `(
				SELECT
					amount
				FROM
					product_prices
				WHERE
					productid = p.rowid
					AND type = ?
			) < ?`)
			args = append(args, type_)
			args = append(args, val)
		}
	}
	var orderbysql string
	if val, ok := filters["sort"]; ok {
		switch val {
		case "1":
			if type_, ok := filters["price_type"]; ok {
				orderbysql = `ORDER BY (
					SELECT
						amount
					FROM
						product_prices
					WHERE
						productid = p.rowid
						AND type = ?
						
				) ASC`
				args = append(args, type_)
			}
		case "2":
			if type_, ok := filters["price_type"]; ok {
				orderbysql = `ORDER BY (
					SELECT
						amount
					FROM
						product_prices
					WHERE
						productid = p.rowid
						AND type = ?
						
				) DESC`
				args = append(args, type_)
			}
		case "3":
			orderbysql = `ORDER BY updated_at DESC`
		default:
			if _, ok := filters["query"]; ok {
				orderbysql = `ORDER BY rank`
			}
		}
	}
	var pagesql string
	if val, ok := filters["page"]; ok {
		page_size := "30"
		if val, ok := filters["page_size"]; ok {
			page_size = val
		}
		pagesql = `LIMIT ? OFFSET ?`
		npage, _ := strconv.Atoi(val)
		npage_size, _ := strconv.Atoi(page_size)
		noffset := (npage - 1) * npage_size
		offset := strconv.Itoa(noffset)
		args = append(args, page_size)
		args = append(args, offset)
	}
	q := `
	SELECT
		p.rowid, name, quantity, slug
	FROM
		products_fts AS p_fts
		JOIN products AS p ON p_fts.rowid = p.rowid
	WHERE
		` + strings.Join(wheresql, " AND ") + `
	` + orderbysql + `
	` + pagesql + `
	;`
	err := db.Select(&products, q, args...)
	if err != nil {
		return []Product{}, err
	}
	for _, p := range products {
		err := db.foreignFieldsGet(&p)
		if err != nil {
			return []Product{}, err
		}
	}
	return products, nil
}

func (db *DB) foreignFieldsGet(p *Product) error {
	err := db.Select(&p.Prices, `
	SELECT
		type, amount, minquantity
	FROM
		product_prices
	WHERE
		productid = ?
	;`, p.RowID)
	if err != nil {
		return err
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
		return err
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
		return err
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
		return err
	}
	return nil
}
