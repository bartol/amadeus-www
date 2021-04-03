package main

import "net/http"

func main() {
	http.HandleFunc("/", indexHandler)
	http.ListenAndServe(":8080", nil)
}

/*
package main

// go + postgresql + systemd

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", os.Getenv("DBCONN"))
	if err != nil {
		log.Fatal(err)
	}

	age := 21
	rows, err := db.Query("SELECT name FROM users WHERE age > $1", age)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%s is over %d\n", name, age)
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
}

// (crontab -l; echo "0 8 * * * echo another job 4") | crontab -   <-- add job to crontab

/*
 * Assuming that you're using the net/smtp package and so the
 * smtp.SendMail function, you just need to declare the MIME type in your
 * message.
 *
 * ```
 * subject := "Subject: Test email from Go!\n"
 * mime := "MIME-version: 1.0;\nContent-Type: text/html;
 * charset=\"UTF-8\";\n\n"
 * body := "<html><body><h1>Hello World!</h1></body></html>"
 * msg := []byte(subject + mime + body)
 *
 * smtp.SendMail(server, auth, from, to, msg)
 * ```
 *
 * Hope this helps =)
 *
 * [GreyHands] [so/q/9950098] [cc by-sa 3.0]
*/
