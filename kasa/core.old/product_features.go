package core

import "encoding/json"

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
		return ResponseFailure(404, "ProductFeatureGet: Značajka proizvoda nije pronađena", err)
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

// ProductFeatureCreate accepts json encoded Feature, creates product feature in db and returns json encoded created Feature
func ProductFeatureCreate(data string) string {
	productFeature := Feature{}
	err := json.Unmarshal([]byte(data), &productFeature)
	if err != nil {
		return ResponseFailure(500, "ProductFeatureCreate: Pogreška pri deserializaciji zahtjeva", err)
	}

	if productFeature.Name == "" {
		return ResponseFailure(400, "ProductFeatureCreate: Značajka proizvoda mora imati ime", nil)
	}
	if productFeature.Category == "" {
		return ResponseFailure(400, "ProductFeatureCreate: Značajka proizvoda mora imati kategoriju", nil)
	}

	tx := Global.DB.MustBegin()

	recommended := "n"
	if productFeature.Recommended {
		recommended = "t"
	}

	err = tx.QueryRow(
		`INSERT INTO product_features (name,recommended,category_id) 
		VALUES ($1,$2,$3)
		RETURNING product_feature_id`, productFeature.Name, recommended,
		productFeature.CategoryID).Scan(&productFeature.ProductFeatureID)
	if err != nil {
		return ResponseFailure(500, "ProductFeatureCreate: Pogreška pri dodavanju značajke proizvoda u bazu podataka", err)
	}

	tx.Commit()

	return ProductFeatureGet(productFeature.ProductFeatureID)
}

// ProductFeatureUpdate accepts json encoded Feature, updates product feature in db and returns json encoded updated Feature
func ProductFeatureUpdate(data string) string {
	productFeature := Feature{}
	err := json.Unmarshal([]byte(data), &productFeature)
	if err != nil {
		return ResponseFailure(500, "ProductFeatureUpdate: Pogreška pri deserializaciji zahtjeva", err)
	}

	if productFeature.Name == "" {
		return ResponseFailure(400, "ProductFeatureUpdate: Značajka proizvoda mora imati ime", nil)
	}
	if productFeature.Category == "" {
		return ResponseFailure(400, "ProductFeatureUpdate: Značajka proizvoda mora imati kategoriju", nil)
	}

	tx := Global.DB.MustBegin()

	var exists bool
	err = tx.QueryRow(
		"SELECT EXISTS(SELECT 1 FROM product_features WHERE product_feature_id = $1)",
		productFeature.ProductFeatureID).Scan(&exists)
	if err != nil {
		return ResponseFailure(500, "ProductFeatureUpdate: Pogreška pri provjeri postojanja značajke proizvoda", nil)
	}
	if !exists {
		return ResponseFailure(404, "ProductFeatureUpdate: Značajka proizvoda ne postoji", nil)
	}

	tx.MustExec(
		`UPDATE product_features 
		SET name = $2,
			recommended = $3,
			category_id = $4
		WHERE product_feature_id = $1`,
		productFeature.ProductFeatureID, productFeature.Name,
		productFeature.Recommended, productFeature.CategoryID)

	tx.Commit()

	return ProductFeatureGet(productFeature.ProductFeatureID)
}
