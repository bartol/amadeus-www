package main

import (
	"embed"
	"log"
	"net/http"
	"os"
)

//go:embed assets
var assets embed.FS

func main() {
	http.HandleFunc("/", routerHandler)
	http.HandleFunc("/kosarica/", cartHandler)
	http.HandleFunc("/admin/", adminHandler)
	http.Handle("/assets/", http.FileServer(http.FS(assets)))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Server listening on http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
