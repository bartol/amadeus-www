package main

import (
	"log"
	"net/http"

	"git.sr.ht/~bd/amadeus2.hr/html"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	p := html.IndexParams{
		User: "test usr",
	}
	err := html.Index(w, p)
	if err != nil {
		log.Println(err)
	}
}
