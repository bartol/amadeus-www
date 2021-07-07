package data

func (db *DB) CategoryCheck(slug string) bool {
	return false
}

func (db *DB) CategoryGet(slug string) (Category, error) {
	return Category{}, nil
}

func (db *DB) CategoryList(product_id int) ([]Category, error) {
	var categories []Category
	rows, err := db.Query(`
	SELECT
		name, slug
	FROM
		product_categories AS p
		JOIN categories AS c ON p.category_id = c.id
	WHERE
		product_id = ?
	;`, product_id)
	if err != nil {
		return []Category{}, err
	}
	defer rows.Close()
	for rows.Next() {
		var (
			name string
			slug string
		)
		err := rows.Scan(&name, &slug)
		if err != nil {
			return []Category{}, err
		}
		c := Category{
			Name: name,
			Slug: slug,
		}
		categories = append(categories, c)
	}
	if err = rows.Err(); err != nil {
		return []Category{}, err
	}
	return categories, nil
}
