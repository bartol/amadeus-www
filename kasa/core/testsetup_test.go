package core

import (
	"flag"
	"os"
	"testing"
)

var Update = flag.Bool("update", false, "update golden files")

func TestMain(m *testing.M) {
	// get config file path argument
	configPath := flag.String("config", "test.toml", "configuration file path")
	flag.Parse()

	// run core setup function that configures database, logger, ...
	err := Setup(*configPath)
	if err != nil {
		panic(err)
	}

	os.Exit(m.Run())
}
