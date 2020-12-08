package core

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
