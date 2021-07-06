package data

func (db DB) CategoryCheck(slug string) bool {
	return false
}

func (db DB) CategoryGet(slug string) (Category, error) {
	return Category{}, nil
}
