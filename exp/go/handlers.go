package main

import (
	"log"
	"net/http"
	"strconv"

	"git.sr.ht/~bd/amadeus2.hr/html"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("404 starnica ne postoji"))
		return
	}
	p := html.IndexParams{
		User: "test usr",
	}
	err := html.Index(w, p)
	if err != nil {
		log.Println(err)
	}
}

func productHandler(w http.ResponseWriter, r *http.Request) {
	ID, err := extractID(r.URL.Path)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("404 starnica ne postoji"))
		return
	}
	w.Write([]byte("proizvod ID: " + strconv.Itoa(ID)))
}

func categoryHandler(w http.ResponseWriter, r *http.Request) {
	ID, err := extractID(r.URL.Path)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("404 starnica ne postoji"))
		return
	}
	w.Write([]byte("kategorija ID: " + strconv.Itoa(ID)))
}
