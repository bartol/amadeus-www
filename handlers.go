package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
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
	notFoundHandler(w, r)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("index"))
}

func productHandler(slug string, w http.ResponseWriter, r *http.Request) {
	p, err := db.ProductGet(slug)
	if err == sql.ErrNoRows {
		notFoundHandler(w, r)
		return
	}
	if err != nil {
		log.Print(err)
		internalServerErrorHandler(w, r)
		return
	}
	s, _ := json.MarshalIndent(p, "", "\t")
	w.Write(s)
}

func categoryHandler(slug string, w http.ResponseWriter, r *http.Request) {
	c, err := db.CategoryGet(slug)
	if err == sql.ErrNoRows {
		notFoundHandler(w, r)
		return
	}
	if err != nil {
		log.Print(err)
		internalServerErrorHandler(w, r)
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

func notFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("404"))
}

func internalServerErrorHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("500"))
}
