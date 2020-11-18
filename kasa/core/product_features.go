package core

// Feature is struct that contains product feature info
type Feature struct {
	ProductFeatureID int    `db:"product_feature_id" json:"product_feature_id"`
	CategoryID       int    `db:"category_id" json:"category_id"`
	Name             string `db:"name" json:"name"`
	Recommended      bool   `db:"recommended" json:"recommended"`
	Category         string `db:"category" json:"category"`
}

// ProductFeatureGet returns json encoded Feature
func ProductFeatureGet(productFeatureID int) string {
	productFeature := Feature{}
	err := Global.DB.Get(&productFeature,
		`SELECT f.*, c.name AS category 
		FROM product_features f 
		INNER JOIN categories c ON  f.category_id = c.category_id 
		WHERE f.product_feature_id = $1;`, productFeatureID)
	if err != nil {
		return ResponseFailure(404, "ProductFeatureGet: Značajka nije pronađena", err)
	}

	return ResponseSuccess(productFeature, "ProductFeatureGet")
}

// ProductFeatureGetList returns json encoded list of Feature sorted by category id desc
func ProductFeatureGetList() string {
	productFeatures := []Feature{}
	err := Global.DB.Select(&productFeatures,
		`SELECT f.*, c.name AS category 
		FROM product_features f 
		INNER JOIN categories c ON  f.category_id = c.category_id
		ORDER BY category_id DESC`)
	if err != nil {
		return ResponseFailure(500, "ProductFeatureGetList: internal server error", err)
	}

	return ResponseSuccess(productFeatures, "ProductFeatureGetList")
}

// ProductFeatureCreate is stub TODO
func ProductFeatureCreate(data string) string {
	return "stub"
}
