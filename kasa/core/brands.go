package core

import (
	"errors"

	"github.com/gosimple/slug"
	"github.com/mitchellh/mapstructure"
)

// Brand is struct that contains brand info
type Brand struct {
	BrandID int    `db:"brand_id"`
	Name    string `db:"name"`
	URL     string `db:"url"`
}

// BrandGet returns single brand
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

// BrandList returns list of brands
func BrandList() ([]Brand, error) {
	brands := []Brand{}

	err := Global.DB.Select(&brands,
		`SELECT brand_id, name, url
		FROM brands
		ORDER BY name ASC`)
	if err != nil {
		Global.Log.Error(err)
		return []Brand{}, err
	}

	return brands, nil
}

// BrandCreate creates brand in db and returns it
func BrandCreate(data map[string]interface{}) (Brand, error) {
	brand := Brand{}

	// decode request parameters
	err := mapstructure.Decode(data, &brand)
	if err != nil {
		Global.Log.Error(err)
		return Brand{}, err
	}

	// check if brand is valid
	if brand.Name == "" {
		err := errors.New("Brend mora imati ime")
		Global.Log.Error(err)
		return Brand{}, err
	}

	// create brand url from its name
	brand.URL = slug.Make(brand.Name)

	// start db transaction
	tx, err := Global.DB.Begin()
	if err != nil {
		Global.Log.Error(err)
		return Brand{}, err
	}

	// insert brand
	err = tx.QueryRow(
		`INSERT INTO brands (name, url)
		VALUES ($1, $2)
		RETURNING brand_id;`, brand.Name, brand.URL).Scan(&brand.BrandID)
	if err != nil {
		Global.Log.Error(err)
		return Brand{}, err
	}

	// commit transaction
	err = tx.Commit()
	if err != nil {
		Global.Log.Error(err)
		return Brand{}, err
	}

	// get created brand
	createdbrand, err := BrandGet(brand.BrandID)
	if err != nil {
		Global.Log.Error(err)
		return Brand{}, err
	}

	return createdbrand, nil
}

// BrandUpdate updates brand in db and returns it
func BrandUpdate(data map[string]interface{}) (Brand, error) {
	brand := Brand{}

	// decode request parameters
	err := mapstructure.Decode(data, &brand)
	if err != nil {
		Global.Log.Error(err)
		return Brand{}, err
	}

	// check if brand is valid
	if brand.Name == "" {
		err := errors.New("Brend mora imati ime")
		Global.Log.Error(err)
		return Brand{}, err
	}

	// create brand url from its name
	brand.URL = slug.Make(brand.Name)

	// start db transaction
	tx, err := Global.DB.Begin()
	if err != nil {
		Global.Log.Error(err)
		return Brand{}, err
	}

	// check if brand exists
	var exists bool
	err = tx.QueryRow(
		`SELECT EXISTS(
			SELECT 1
			FROM brands
			WHERE brand_id = $1
		);`, brand.BrandID).Scan(&exists)
	if err != nil {
		Global.Log.Error(err)
		return Brand{}, err
	}
	if !exists {
		err := errors.New("Brend ne postoji")
		Global.Log.Error(err)
		return Brand{}, err
	}

	// update brand
	_, err = tx.Exec(
		`UPDATE brands
		SET name = $2,
			url = $3
		WHERE brand_id = $1;`, brand.BrandID, brand.Name, brand.URL)
	if err != nil {
		Global.Log.Error(err)
		return Brand{}, err
	}

	// commit transaction
	err = tx.Commit()
	if err != nil {
		Global.Log.Error(err)
		return Brand{}, err
	}

	// get updated brand
	updatedbrand, err := BrandGet(brand.BrandID)
	if err != nil {
		Global.Log.Error(err)
		return Brand{}, err
	}

	return updatedbrand, nil
}
