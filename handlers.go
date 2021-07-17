package main

import (
	"database/sql"
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
	p := html.IndexParams{}
	err := html.Index(w, p)
	if err != nil {
		internalServerErrorHandler(w, err)
	}
}

func productHandler(slug string, w http.ResponseWriter, r *http.Request) {
	product, err := db.ProductGet(slug)
	if err == sql.ErrNoRows {
		notFoundHandler(w)
		return
	}
	if err != nil {
		internalServerErrorHandler(w, err)
		return
	}

	p := html.ProductParams{Product: product}
	if err := html.Product(w, p); err != nil {
		internalServerErrorHandler(w, err)
	}
}

func categoryHandler(slug string, w http.ResponseWriter, r *http.Request) {
	category, err := db.CategoryGet(slug)
	if err == sql.ErrNoRows {
		notFoundHandler(w)
		return
	}
	if err != nil {
		internalServerErrorHandler(w, err)
		return
	}

	filters := map[string]string{"category_slug": slug}
	products, err := db.ProductList(filters)
	if err != nil {
		internalServerErrorHandler(w, err)
		return
	}

	p := html.CategoryParams{Category: category, Products: products}
	if err := html.Category(w, p); err != nil {
		internalServerErrorHandler(w, err)
	}
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
