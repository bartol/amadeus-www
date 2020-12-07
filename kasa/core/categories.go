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
