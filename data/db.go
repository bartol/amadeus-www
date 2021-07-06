package data

import (
	"database/sql"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

type DB struct {
	Conn *sql.DB
}

func DatabaseGet() (DB, error) {
	conn, err := sql.Open("sqlite3", os.Getenv("DB"))
	if err != nil {
		return DB{}, err
	}

	return DB{conn}, nil
}
