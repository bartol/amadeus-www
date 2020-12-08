package core

import (
	"errors"

	"github.com/gosimple/slug"
	"github.com/mitchellh/mapstructure"
)

// Category is struct that contains category info
type Category struct {
	CategoryID int    `db:"category_id"`
	Name       string `db:"name"`
	URL        string `db:"url"`
}

// CategoryGet returns single category
func CategoryGet(categoryID int) (Category, error) {
	category := Category{}

	err := Global.DB.Get(&category,
		`SELECT category_id, name, url
		FROM categories
		WHERE category_id = $1;`, categoryID)
	if err != nil {
		Global.Log.Error(err)
		return Category{}, err
	}

	return category, nil
}

// CategoryList returns list of categories
func CategoryList() ([]Category, error) {
	categories := []Category{}

	err := Global.DB.Select(&categories,
		`SELECT category_id, name, url
		FROM categories
		ORDER BY name ASC`)
	if err != nil {
		Global.Log.Error(err)
		return []Category{}, err
	}

	return categories, nil
}

// CategoryCreate creates category in db and returns it
func CategoryCreate(data map[string]interface{}) (Category, error) {
	category := Category{}

	// decode request parameters
	err := mapstructure.Decode(data, &category)
	if err != nil {
		Global.Log.Error(err)
		return Category{}, err
	}

	// check if category is valid
	if category.Name == "" {
		err := errors.New("Kategorija mora imati ime")
		Global.Log.Error(err)
		return Category{}, err
	}

	// create category url from its name
	category.URL = slug.Make(category.Name)

	// start db transaction
	tx, err := Global.DB.Begin()
	if err != nil {
		Global.Log.Error(err)
		return Category{}, err
	}

	// insert category
	err = tx.QueryRow(
		`INSERT INTO categories (name, url)
		VALUES ($1, $2)
		RETURNING category_id;`, category.Name, category.URL).Scan(&category.CategoryID)
	if err != nil {
		Global.Log.Error(err)
		return Category{}, err
	}

	// commit transaction
	err = tx.Commit()
	if err != nil {
		Global.Log.Error(err)
		return Category{}, err
	}

	// get created category
	createdcategory, err := CategoryGet(category.CategoryID)
	if err != nil {
		Global.Log.Error(err)
		return Category{}, err
	}

	return createdcategory, nil
}

// CategoryUpdate updates category in db and returns it
func CategoryUpdate(data map[string]interface{}) (Category, error) {
	category := Category{}

	// decode request parameters
	err := mapstructure.Decode(data, &category)
	if err != nil {
		Global.Log.Error(err)
		return Category{}, err
	}

	// check if category is valid
	if category.Name == "" {
		err := errors.New("Kategorija mora imati ime")
		Global.Log.Error(err)
		return Category{}, err
	}

	// create category url from its name
	category.URL = slug.Make(category.Name)

	// start db transaction
	tx, err := Global.DB.Begin()
	if err != nil {
		Global.Log.Error(err)
		return Category{}, err
	}

	// check if category exists
	var exists bool
	err = tx.QueryRow(
		`SELECT EXISTS(
			SELECT 1
			FROM categories
			WHERE category_id = $1
		);`, category.CategoryID).Scan(&exists)
	if err != nil {
		Global.Log.Error(err)
		return Category{}, err
	}
	if !exists {
		err := errors.New("Kategorija ne postoji")
		Global.Log.Error(err)
		return Category{}, err
	}

	// update category
	_, err = tx.Exec(
		`UPDATE categories
		SET name = $2,
			url = $3
		WHERE category_id = $1;`, category.CategoryID, category.Name, category.URL)
	if err != nil {
		Global.Log.Error(err)
		return Category{}, err
	}

	// commit transaction
	err = tx.Commit()
	if err != nil {
		Global.Log.Error(err)
		return Category{}, err
	}

	// get updated category
	updatedcategory, err := CategoryGet(category.CategoryID)
	if err != nil {
		Global.Log.Error(err)
		return Category{}, err
	}

	return updatedcategory, nil
}
