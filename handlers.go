package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/bdeak4/amadeus2.hr/html"
)

// surface web handlers

func surfaceRouter(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		indexHandler(w, r)
		return
	}
	slug := extractSlug(r.URL.Path)
	if db.ProductCheck(slug) {
		productHandler(slug, w, r)
		return
	}
	if db.CategoryCheck(slug) {
		categoryHandler(slug, w, r)
		return
	}
	if db.RedirectCheck(slug) {
		redirectHandler(slug, w, r)
		return
	}
	notFoundHandler(w)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	p := html.IndexParams{
		Message: "test msg",
	}
	err := html.Index(w, p)
	if err != nil {
		internalServerErrorHandler(w, err)
	}
}

func productHandler(slug string, w http.ResponseWriter, r *http.Request) {
	p, err := db.ProductGet(slug)
	if err == sql.ErrNoRows {
		notFoundHandler(w)
		return
	}
	if err != nil {
		internalServerErrorHandler(w, err)
		return
	}
	s, _ := json.MarshalIndent(p, "", "\t")
	w.Write(s)
}

func categoryHandler(slug string, w http.ResponseWriter, r *http.Request) {
	c, err := db.CategoryGet(slug)
	if err == sql.ErrNoRows {
		notFoundHandler(w)
		return
	}
	if err != nil {
		internalServerErrorHandler(w, err)
		return
	}
	s, _ := json.MarshalIndent(c, "", "\t")
	w.Write(s)
}

func redirectHandler(slug string, w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("redirect"))
}

// admin handlers

func adminRouter(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("admin"))
}

// error handlers

func notFoundHandler(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("404"))
}

func internalServerErrorHandler(w http.ResponseWriter, err error) {
	log.Print(err)
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("500"))
}
