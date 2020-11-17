package core

import (
	"github.com/jmoiron/sqlx"

	// postgresql driver
	_ "github.com/lib/pq"
)

// Global contains global variables like database connection etc
var Global = struct {
	DB *sqlx.DB
}{}

// Setup is function that configures Global var
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
