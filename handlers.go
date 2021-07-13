package main

import (
	"database/sql"
	"log"
	"net/http"
)

// surface web handlers
func surfaceRouter(w http.ResponseWriter, r *http.Request) {
	// if root then serve index page
	if r.URL.Path == "/" {
		indexHandler(w, r)
		return
	}
	// extract slug from path
	slug := extractSlug(r.URL.Path)
	// check if slug matches product
	if db.ProductCheck(slug) {
		productHandler(slug, w, r)
		return
	}
	// check if slug matches category
	if db.CategoryCheck(slug) {
		categoryHandler(slug, w, r)
		return
	}
	// check if slug matches redirect
	if db.RedirectCheck(slug) {
		redirectHandler(slug, w, r)
		return
	}
	// page not found
	notFoundHandler(w, r)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("index"))
}

func productHandler(slug string, w http.ResponseWriter, r *http.Request) {
	p, err := db.ProductGet(slug)
	pp(p)
	if err == sql.ErrNoRows {
		notFoundHandler(w, r)
		return
	}
	if err != nil {
		log.Print(err)
		internalServerErrorHandler(w, r)
		return
	}
	w.Write([]byte(p.Name))
}

func categoryHandler(slug string, w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("category"))
}

func redirectHandler(slug string, w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("redirect"))
}

// admin handlers
func adminRouter(w http.ResponseWriter, r *http.Request) {

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
