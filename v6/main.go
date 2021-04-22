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
	http.HandleFunc("/s", searchHandler)
	http.HandleFunc("/kosarica", cartHandler)
	http.Handle("/assets/", http.FileServer(http.FS(assets)))

	port := os.Getenv("PORT")
	log.Println("Server listening on http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
