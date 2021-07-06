package data

func (db DB) ProductCheck(slug string) bool {
	return true
}

func (db DB) ProductGet(slug string) (Product, error) {
	var name string
	var description string
	err := db.Conn.QueryRow(`
	SELECT
		name,
		description
	FROM
		products
	WHERE
		slug = ?
	`, slug).Scan(&name, &description)
	if err != nil {
		return Product{}, err
	}

	p := Product{
		Name:        name,
		Description: description,
	}

	return p, nil
}

func (db DB) ProductList(filters map[string]string) ([]Product, error) {
	// filters: query, category_slug, feature, sort, page, price_min, price_max
	return []Product{}, nil
}
