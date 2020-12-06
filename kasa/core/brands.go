package core

// Brand is struct that contains brand info
type Brand struct {
	BrandID int    `db:"brand_id"`
	Name    string `db:"name"`
	URL     string `db:"url"`
}

// BrandGet returns single Brand
func BrandGet(brandID int) (Brand, error) {
	brand := Brand{}

	err := Global.DB.Get(&brand,
		`SELECT brand_id, name, url
		FROM brands
		WHERE brand_id = $1;`, brandID)
	if err != nil {
		Global.Log.Error(err)
		return Brand{}, err
	}

	return brand, nil
}
