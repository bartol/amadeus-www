package data

func (db *DB) CategoryCheck(slug string) bool {
	var n int
	err := db.Get(&n, `
	SELECT
		1
	FROM
		categories
	WHERE
		slug = ?
	;`, slug)
	if err != nil {
		return false
	}
	return true
}

func (db *DB) CategoryGet(slug string) (Category, error) {
	var c Category
	err := db.Get(&c, `
	SELECT
		rowid, name, description, slug
	FROM
		categories
	WHERE
		slug = ?
	;`, slug)
	if err != nil {
		return Category{}, err
	}
	err = db.Select(&c.FeaturedProducts, `
	SELECT
		label, name, (
			SELECT
				url
			FROM
				product_images
			WHERE
				productid = p.rowid
				AND position = 0
		) AS image, (
			SELECT
				amount
			FROM
				product_prices
			WHERE
				productid = p.rowid
				AND type = 1
		) AS price
	FROM
		featured_products AS fp
		JOIN products AS p ON fp.productid = p.rowid
	WHERE
		categoryid = ?
	;`, c.RowID)
	if err != nil {
		return Category{}, err
	}
	return c, nil
}
