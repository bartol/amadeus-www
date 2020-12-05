package core

// Product is struct that contains product info
type Product struct {
	ProductID   int    `db:"product_id"`
	Name        string `db:"name"`
	Price       int    `db:"price"`
	Discount    int    `db:"discount"`
	Quantity    int    `db:"quantity"`
	Description string `db:"description"`
	URL         string `db:"url"`
	Recommended bool   `db:"recommended"`
	CreatedAt   string `db:"created_at"`
	UpdatedAt   string `db:"updated_at"`
	Brand       string `db:"brand"`
	BrandID     int    `db:"brand_id"`
	Category    string `db:"category"`
	CategoryID  int    `db:"category_id"`
	Images      []struct {
		ImageID int    `db:"product_image_id"`
		URL     string `db:"url"`
	}
	Features []struct {
		FeatureID      int    `db:"product_feature_id"`
		FeatureValueID int    `db:"product_feature_value_id"`
		Name           string `db:"name"`
		Value          string `db:"value"`
		Recommended    bool   `db:"recommended"`
	}
	Publications []struct {
		PublicationID int    `db:"publication_id"`
		Name          string `db:"name"`
	}
	Recommendations []Product
}

// ProductGet returns single Product
func ProductGet(productID int, light bool) (Product, error) {
	product := Product{}

	// get light columns
	err := Global.DB.Get(&product,
		`SELECT product_id, p.name, price, discount, url, recommended, updated_at,
			created_at, brand_id, b.name AS brand, category_id, c.name AS category
		FROM products p
		INNER JOIN brands b USING (brand_id)
		INNER JOIN categories c USING (category_id)
		WHERE product_id = $1;`, productID)
	if err != nil {
		Global.Log.Error(err)
		return Product{}, err
	}

	// get heavy columns
	if !light {
		err := Global.DB.Get(&product,
			`SELECT description
			FROM products
			WHERE product_id = $1;`, productID)
		if err != nil {
			Global.Log.Error(err)
			return Product{}, err
		}

		err = Global.DB.Select(&product.Images,
			`SELECT product_image_id, url
			FROM product_images
			WHERE product_id = $1;`, productID)
		if err != nil {
			Global.Log.Error(err)
			return Product{}, err
		}

		err = Global.DB.Select(&product.Features,
			`SELECT product_feature_id, product_feature_value_id, name, value, recommended
			FROM product_feature_values
			INNER JOIN product_features USING (product_feature_id)
			WHERE product_id = $1;`, productID)
		if err != nil {
			Global.Log.Error(err)
			return Product{}, err
		}

		err = Global.DB.Select(&product.Publications,
			`SELECT publication_id, name
			FROM product_publications
			INNER JOIN publications USING (publication_id)
			WHERE product_id = $1;`, productID)
		if err != nil {
			Global.Log.Error(err)
			return Product{}, err
		}

		err = Global.DB.Select(&product.Recommendations,
			`SELECT p.product_id, p.name, price, discount, url, recommended, updated_at,
				created_at, brand_id, b.name AS brand, category_id, c.name AS category
			FROM product_recommendations r
			INNER JOIN products p ON recommended_product_id = p.product_id
			INNER JOIN brands b USING (brand_id)
			INNER JOIN categories c USING (category_id)
			WHERE r.product_id = $1;`, productID)
		if err != nil {
			Global.Log.Error(err)
			return Product{}, err
		}
	}

	return product, nil
}

// ProductList returns list of Product
func ProductList(offset int, limit int) ([]Product, error) {
	products := []Product{}

	err := Global.DB.Select(&products,
		`SELECT product_id, p.name, price, discount, url, recommended, updated_at,
			created_at, brand_id, b.name AS brand, category_id, c.name AS category
		FROM products p
		INNER JOIN brands b USING (brand_id)
		INNER JOIN categories c USING (category_id)
		ORDER BY updated_at DESC
		OFFSET $1 LIMIT $2;`, offset, limit)
	if err != nil {
		Global.Log.Error(err)
		return []Product{}, err
	}

	return products, nil
}
