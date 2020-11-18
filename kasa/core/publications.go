package core

// Publication is struct that contains publication info
type Publication struct {
	PublicationID int    `db:"publication_id" json:"publication_id"`
	Name          string `db:"name" json:"name"`
}

// PublicationGetList returns json encoded list of Publication
func PublicationGetList() string {
	publications := []Publication{}
	err := Global.DB.Select(&publications, "SELECT * FROM publications;")
	if err != nil {
		return ResponseFailure(500, "PublicationGetList: internal server error", err)
	}

	return ResponseSuccess(publications, "PublicationGetList")
}
