package main

import (
	"log"
	"net/http"

	"github.com/bartol/amadeus2.hr/data"
)

func routerHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		indexHandler(w, r)
		return
	}
	x := extract(r.URL.Path)
	w.Write([]byte(x))
	// check if x is category
	// check if x is product
	// check if x is redirect
	// try if amadeus2.hr link
	// try if pioneer.hr link
	// 404
	/*
		p := html.IndexParams{
			User: "test usr",
		}
		err := html.Index(w, p)
		if err != nil {
			log.Println(err)
		}
	*/
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	p, err := data.ProductList(map[string]string{})
	log.Print(p, err)
	w.Write([]byte("index"))
}

func productHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("product"))
}

func categoryHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("category"))
}

func redirectHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("redirect"))
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("search"))
}

func cartHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(r.Host))
}

func adminHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("admin"))
}

func notFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("404"))
}
