package core

import (
	"encoding/json"
	"time"

	"github.com/metal3d/go-slugify"
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
	ProductImages          []ProductImage       `json:"product_images"`
	ProductFeatures        []ProductFeature     `json:"product_features"`
	ProductPublications    []ProductPublication `json:"product_publications"`
	ProductRecommendations []ProductSlim        `json:"product_recommendations"`
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
	err := Global.DB.Get(&product,
		`SELECT p.*,b.name AS brand,c.name AS category
		FROM products p
		INNER JOIN brands b ON p.brand_id = b.brand_id
		INNER JOIN categories c ON p.category_id = c.category_id
		WHERE p.product_id = $1`, product_id)
	if err != nil {
		return ResponseFailure(404, "Proizvod nije pronađen", err)
	}

	Global.DB.Select(&product.ProductImages,
		`SELECT *
		FROM product_images
		WHERE product_id = $1`, product_id)

	Global.DB.Select(&product.ProductFeatures,
		`SELECT *
		FROM product_feature_values v
		INNER JOIN product_features f ON v.product_feature_id = f.product_feature_id
		WHERE v.product_id = $1`, product_id)

	Global.DB.Select(&product.ProductPublications,
		`SELECT *
		FROM product_publications pp
		INNER JOIN publications p ON pp.publication_id = p.publication_id
		WHERE product_id = $1`, product_id)

	Global.DB.Select(&product.ProductRecommendations,
		`SELECT p.product_id,p.name,p.price,p.discount,p.quantity,p.url,p.recommended,
			p.created_at,p.updated_at,b.name AS brand,c.name AS category
		FROM product_recommendations r
		INNER JOIN products p ON r.recommended_product_id = p.product_id
		INNER JOIN brands b ON p.brand_id = b.brand_id
		INNER JOIN categories c ON p.category_id = c.category_id
		WHERE r.product_id = $1`, product_id)

	return ResponseSuccess(product)
}

func ProductGetListSlim(offset, limit int) string {
	products := []ProductSlim{}
	err := Global.DB.Select(&products,
		`SELECT p.product_id,p.name,p.price,p.discount,p.quantity,p.url,p.recommended,
			p.created_at,p.updated_at,b.name AS brand,c.name AS category
		FROM products p
		INNER JOIN brands b ON p.brand_id = b.brand_id
		INNER JOIN categories c ON p.category_id = c.category_id
		ORDER BY updated_at DESC
		OFFSET $1 LIMIT $2;`, offset, limit)
	if err != nil {
		return ResponseFailure(500, err.Error(), err)
	}

	return ResponseSuccess(products)
}

func ProductGetListSlimModified(products string) string {
	return "stub"
}

func ProductCreate(data string) string {
	product := Product{}
	err := json.Unmarshal([]byte(data), &product)
	if err != nil {
		return ResponseFailure(500, "Pogreška pri deserializaciji zahtjeva", err)
	}

	if product.Name == "" {
		return ResponseFailure(400, "Proizvod mora imati ime", nil)
	}
	if product.Price == 0 {
		return ResponseFailure(400, "Proizvod mora imati cijenu", nil)
	}
	if product.Brand == "" {
		return ResponseFailure(400, "Proizvod mora imati brend", nil)
	}
	if product.Category == "" {
		return ResponseFailure(400, "Proizvod mora imati kategoriju", nil)
	}

	product.URL = slugify.Marshal(product.Name)

	tx := Global.DB.MustBegin()

	if product.BrandID == 0 {
		err := tx.QueryRow("INSERT INTO brands (name) VALUES ($1) RETURNING brand_id",
			product.Brand).Scan(&product.BrandID)
		if err != nil {
			return ResponseFailure(500, "Pogreška pri dodavanju novog brenda u bazu podataka", err)
		}
	}

	if product.CategoryID == 0 {
		err := tx.QueryRow("INSERT INTO categories (name) VALUES ($1) RETURNING category_id",
			product.Category).Scan(&product.CategoryID)
		if err != nil {
			return ResponseFailure(500, "Pogreška pri dodavanju nove kategorije u bazu podataka", err)
		}
	}

	err = tx.QueryRow(
		`INSERT INTO products (name,price,discount,quantity,description,url,recommended,created_at,updated_at,
			brand_id,category_id) VALUES ($1,$2,$3,$4,$5,$6,$7,now()::TIMESTAMP,now()::TIMESTAMP,$8,$9)
			RETURNING product_id`, product.Name, product.Price, product.Discount, product.Quantity, product.Description,
		product.URL, product.Recommended, product.BrandID, product.CategoryID).Scan(&product.ProductID)
	if err != nil {
		return ResponseFailure(500, "Pogreška pri dodavanju proizvoda u bazu podataka", err)
	}

	for _, product_image := range product.ProductImages {
		tx.MustExec("INSERT INTO product_images (url,product_id) VALUES ($1,$2)",
			product_image.URL, product.ProductID)
	}

	for _, product_feature := range product.ProductFeatures {
		if product_feature.ProductFeatureID == 0 {
			recommended := "n"
			if product_feature.Recommended {
				recommended = "t"
			}

			err := tx.QueryRow(`INSERT INTO product_features (name,recommended,category_id) VALUES ($1,$2,$3)
			RETURNING product_feature_id`, product_feature.Name, recommended,
				product.CategoryID).Scan(&product_feature.ProductFeatureID)
			if err != nil {
				return ResponseFailure(500, "Pogreška pri dodavanju značaljke proizvoda u bazu podataka", err)
			}
		}

		tx.MustExec("INSERT INTO product_feature_values (value,product_feature_id,product_id) VALUES ($1,$2,$3)",
			product_feature.Value, product_feature.ProductFeatureID, product.ProductID)
	}

	for _, product_publication := range product.ProductPublications {
		tx.MustExec("INSERT INTO product_publications (publication_id,product_id) VALUES ($1,$2)",
			product_publication.PublicationID, product.ProductID)
	}

	for _, product_recommendation := range product.ProductRecommendations {
		tx.MustExec("INSERT INTO product_recommendations (recommended_product_id,product_id) VALUES ($1,$2)",
			product_recommendation.ProductID, product.ProductID)
	}

	tx.Commit()

	return ProductGet(product.ProductID)
}

func ProductUpdate(data string) string {
	product := Product{}
	err := json.Unmarshal([]byte(data), &product)
	if err != nil {
		return ResponseFailure(500, "Pogreška pri deserializaciji zahtjeva", err)
	}

	if product.Name == "" {
		return ResponseFailure(400, "Proizvod mora imati ime", nil)
	}
	if product.Price == 0 {
		return ResponseFailure(400, "Proizvod mora imati cijenu", nil)
	}
	if product.Brand == "" {
		return ResponseFailure(400, "Proizvod mora imati brend", nil)
	}
	if product.Category == "" {
		return ResponseFailure(400, "Proizvod mora imati kategoriju", nil)
	}

	product.URL = slugify.Marshal(product.Name)

	tx := Global.DB.MustBegin()

	var exists bool
	err = tx.QueryRow("SELECT EXISTS(SELECT 1 FROM products WHERE product_id = $1)",
		product.ProductID).Scan(&exists)
	if err != nil {
		return ResponseFailure(500, "Pogreška pri provjeri postojanja proizvoda", nil)
	}
	if !exists {
		return ResponseFailure(400, "Proizvod ne postoji", nil)
	}

	// ...

	tx.Commit()

	return ProductGet(product.ProductID)
}
