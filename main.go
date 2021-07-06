package main

import (
	"bufio"
	"embed"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/bdeak4/amadeus2.hr/data"
)

//go:embed assets
var assets embed.FS

var db data.DB

func main() {
	// load env from file
	if _, err := os.Stat(".env"); err == nil {
		file, err := os.Open(".env")
		if err != nil {
			log.Fatal(err)
		}
		defer file.Close()

		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			line := scanner.Text()
			s := strings.Split(line, "=")
			key, value := s[0], s[1]

			if err := os.Setenv(key, value); err != nil {
				log.Fatal(err)
			}

		}

		if err := scanner.Err(); err != nil {
			log.Fatal(err)
		}
	}

	// get connection to database
	database, err := data.DatabaseGet()
	if err != nil {
		log.Fatal(err)
	}
	db = database

	// surface web routes
	http.HandleFunc("/", surfaceRouter)

	// admin routes
	http.HandleFunc("/admin/", adminRouter)

	// serve files bundled in bin
	http.Handle("/assets/", http.FileServer(http.FS(assets)))

	// starting server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Server listening on http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
