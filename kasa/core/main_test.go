package core

import (
	"flag"
	"log"
	"os"
	"testing"
)

var dbconn = flag.String("dbconn", "", "database connection")

func TestMain(m *testing.M) {
	flag.Parse()

	err := Setup(*dbconn)
	if err != nil {
		log.Fatal(err)
	}

	os.Exit(m.Run())
}
