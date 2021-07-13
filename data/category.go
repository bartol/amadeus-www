package data

func (db *DB) CategoryCheck(slug string) bool {
	var n int
	err := db.Get(&n, `
	SELECT
		1
	FROM
		categories
	WHERE
		slug = ?
	;`, slug)
	if err != nil {
		return false
	}
	return true
}

func (db *DB) CategoryGet(slug string) (Category, error) {
	var c Category
	err := db.Get(&c, `
	SELECT
		rowid, name, description, slug
	FROM
		categories
	WHERE
		slug = ?
	;`, slug)
	if err != nil {
		return Category{}, err
	}
	return c, nil
}
