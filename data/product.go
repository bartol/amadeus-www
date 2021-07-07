package data

func (db *DB) ProductCheck(slug string) bool {
	return true
}

func (db *DB) ProductGet(slug string) (Product, error) {
	var (
		id          int
		name        string
		description string
		quantity    int
		video_url   string
	)
	err := db.QueryRow(`
	SELECT
		id, name, description, quantity, video_url
	FROM
		products
	WHERE
		slug = ?
	;`, slug).Scan(
		&id, &name, &description, &quantity, &video_url,
	)
	if err != nil {
		return Product{}, err
	}
	prices, err := db.PriceList(id)
	if err != nil {
		return Product{}, err
	}
	categories, err := db.CategoryList(id)
	if err != nil {
		return Product{}, err
	}
	image_urls, err := db.ImageList(id)
	if err != nil {
		return Product{}, err
	}
	features, err := db.FeatureList(id)
	if err != nil {
		return Product{}, err
	}
	return Product{
		ID:          id,
		Name:        name,
		Prices:      prices,
		Categories:  categories,
		Description: description,
		Quantity:    quantity,
		ImageURLs:   image_urls,
		VideoURL:    video_url,
		Features:    features,
		Slug:        slug,
	}, nil
}

func (db *DB) ProductList(filters map[string]string) ([]Product, error) {
	// filters: query, category_slug, feature, sort, page, price_min, price_max
	return []Product{}, nil
}
