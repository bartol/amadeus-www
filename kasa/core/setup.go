package core

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var Global = struct {
	DB *sqlx.DB
}{}

func Setup(dbconn string) error {
	// connect to db
	if Global.DB == nil {
		conn, err := sqlx.Connect("postgres", dbconn)
		if err != nil {
			return err
		}
		Global.DB = conn
	}

	return nil
}
