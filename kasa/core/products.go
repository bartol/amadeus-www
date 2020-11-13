package core

import (
	"encoding/json"
	"log"
	"time"
)

type Product struct {
	ProductID              int                  `db:"product_id" json:"product_id"`
	Name                   string               `db:"name" json:"name"`
	Price                  int                  `db:"price" json:"price"`
	Discount               int                  `db:"discount" json:"discount"`
	Quantity               int                  `db:"quantity" json:"quantity"`
	Description            string               `db:"description" json:"description"`
	URL                    string               `db:"url" json:"url"`
	Recommended            bool                 `db:"recommended" json:"recommended"`
	CreatedAt              time.Time            `db:"created_at" json:"created_at"`
	UpdatedAt              time.Time            `db:"updated_at" json:"updated_at"`
	Brand                  string               `db:"brand" json:"brand"`
	BrandID                int                  `db:"brand_id" json:"brand_id"`
	Category               string               `db:"category" json:"category"`
	CategoryID             int                  `db:"category_id" json:"category_id"`
	ProductImages          []ProductImage       `json:"product_images,omitempty"`
	ProductFeatures        []ProductFeature     `json:"product_features,omitempty"`
	ProductPublications    []ProductPublication `json:"product_publications,omitempty"`
	ProductRecommendations []ProductSlim        `json:"product_recommendations,omitempty"`
}

type ProductSlim struct {
	ProductID   int       `db:"product_id" json:"product_id"`
	Name        string    `db:"name" json:"name"`
	Price       int       `db:"price" json:"price"`
	Discount    int       `db:"discount" json:"discount"`
	Quantity    int       `db:"quantity" json:"quantity"`
	URL         string    `db:"url" json:"url"`
	Recommended bool      `db:"recommended" json:"recommended"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time `db:"updated_at" json:"updated_at"`
	Brand       string    `db:"brand" json:"brand"`
	Category    string    `db:"category" json:"category"`
}

type ProductImage struct {
	ProductID      int    `db:"product_id" json:"product_id"`
	ProductImageID int    `db:"product_image_id" json:"product_image_id"`
	URL            string `db:"url" json:"url"`
}

type ProductFeature struct {
	ProductID             int    `db:"product_id" json:"product_id"`
	ProductFeatureID      int    `db:"product_feature_id" json:"product_feature_id"`
	ProductFeatureValueID int    `db:"product_feature_value_id" json:"product_feature_value_id"`
	CategoryID            int    `db:"category_id" json:"category_id"`
	Name                  string `db:"name" json:"name"`
	Value                 string `db:"value" json:"value"`
	Recommended           bool   `db:"recommended" json:"recommended"`
}

type ProductPublication struct {
	ProductID            int    `db:"product_id" json:"product_id"`
	PublicationID        int    `db:"publication_id" json:"publication_id"`
	ProductPublicationID int    `db:"product_publication_id" json:"product_publication_id"`
	Name                 string `db:"name" json:"name"`
}

func ProductGet(product_id int) string {
	product := Product{}
	err := global.DB.Get(&product,
		`SELECT p.*,b.name AS brand,c.name AS category
		FROM products p
		INNER JOIN brands b ON p.brand_id = b.brand_id
		INNER JOIN categories c ON p.category_id = c.category_id
		WHERE p.product_id = $1`, product_id)
	if err != nil {
		log.Println(err) // event
		resp := Response{404, "Proizvod nije pronađen", nil}
		data, _ := json.Marshal(resp)
		return string(data)
	}

	global.DB.Select(&product.ProductImages,
		`SELECT *
		FROM product_images
		WHERE product_id = $1`, product_id)

	global.DB.Select(&product.ProductFeatures,
		`SELECT *
		FROM product_feature_values v
		INNER JOIN product_features f ON v.product_feature_id = f.product_feature_id
		WHERE v.product_id = $1`, product_id)

	global.DB.Select(&product.ProductPublications,
		`SELECT *
		FROM product_publications pp
		INNER JOIN publications p ON pp.publication_id = p.publication_id
		WHERE product_id = $1`, product_id)

	global.DB.Select(&product.ProductRecommendations,
		`SELECT p.product_id,p.name,p.price,p.discount,p.quantity,p.url,p.recommended,
			p.created_at,p.updated_at,b.name AS brand,c.name AS category
		FROM product_recommendations r
		INNER JOIN products p ON r.recommended_product_id = p.product_id
		INNER JOIN brands b ON p.brand_id = b.brand_id
		INNER JOIN categories c ON p.category_id = c.category_id
		WHERE r.product_id = $1`, product_id)

	resp := Response{200, "", product}
	data, err := json.Marshal(resp)
	if err != nil {
		log.Println(err) // event
		resp := Response{500, "Pogreška pri serializaciji odgovora", nil}
		data, _ := json.Marshal(resp)
		return string(data)
	}
	// event
	return string(data)
}

func ProductGetList() string {
	return "stub"
}

func ProductGetListModified(products string) string {
	return "stub"
}

func ProductCreate(product string) string {
	return "stub"
}

func ProductUpdate(product string) string {
	return "stub"
}
