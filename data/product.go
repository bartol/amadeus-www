package data

func (db *DB) ProductCheck(slug string) bool {
	return true
}

func (db *DB) ProductGet(slug string) (Product, error) {
	var p Product
	err := db.Get(&p, `
	SELECT
		id, name, description, quantity, video
	FROM
		products
	WHERE
		slug = ?
	;`, slug)
	if err != nil {
		return Product{}, err
	}
	p.Prices, err = db.PriceList(p.ID)
	if err != nil {
		return Product{}, err
	}
	p.Categories, err = db.CategoryList(p.ID)
	if err != nil {
		return Product{}, err
	}
	p.Images, err = db.ImageList(p.ID)
	if err != nil {
		return Product{}, err
	}
	p.Features, err = db.FeatureList(p.ID)
	if err != nil {
		return Product{}, err
	}
	return p, nil
}

func (db *DB) ProductList(filters map[string]string) ([]Product, error) {
	// filters: query, category_slug, feature, sort, page, price_min, price_max
	return []Product{}, nil
}
