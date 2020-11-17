package core

import (
	"flag"
	"log"
	"os"
	"testing"
)

var dbconn = flag.String("dbconn", "", "database connection")
var Update = flag.Bool("update", false, "update golden files")

func TestMain(m *testing.M) {
	flag.Parse()

	err := Setup(*dbconn, "ak_testing")
	if err != nil {
		log.Fatal(err)
	}

	os.Exit(m.Run())
}
