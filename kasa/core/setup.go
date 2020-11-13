package core

import (
  "github.com/jmoiron/sqlx"
  _ "github.com/lib/pq"
)

var Global = struct {
  DB *sqlx.DB
}{}

func SetupEnv() error {
  if Global.DB == nil {
    err := SetupDB()
    if err != nil {
      return err
    }
  }
  return nil
}

func SetupDB() error {
  conn, err := sqlx.Connect("postgres", "user=amadeus password=pw dbname=kasa14 sslmode=disable")
  if err != nil {
    return err
  }
  Global.DB = conn
  return nil
}
