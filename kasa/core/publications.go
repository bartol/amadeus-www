package core

// Publication is struct that contains publication info
type Publication struct {
	PublicationID int    `db:"publication_id"`
	Name          string `db:"name"`
}

// PublicationList returns list of publications
func PublicationList() ([]Publication, error) {
	publications := []Publication{}

	err := Global.DB.Select(&publications,
		`SELECT publication_id, name
		FROM publications
		ORDER BY name ASC`)
	if err != nil {
		Global.Log.Error(err)
		return []Publication{}, err
	}

	return publications, nil
}
