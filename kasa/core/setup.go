package core

import (
  "github.com/jmoiron/sqlx"
  _ "github.com/lib/pq"
)

var global = struct {
  DB *sqlx.DB
}{}

func SetupEnv() error {
  if global.DB == nil {
    err := SetupDB()
    if err != nil {
      return err
    }
  }
  return nil
}

func SetupDB() error {
  conn, err := sqlx.Connect("postgres", "user=amadeus password=pw dbname=kasa13 sslmode=disable")
  if err != nil {
    return err
  }
  global.DB = conn
  return nil
}
