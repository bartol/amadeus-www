package main

import (
	"amadeus-kasa/core"
	"flag"

	"github.com/leaanthony/mewn"
	"github.com/wailsapp/wails"
)

func main() {
	// get config file path argument
	configPath := flag.String("config", "core.toml", "configuration file path")
	flag.Parse()

	// run core setup function that configures database, logger, ...
	err := core.Setup(*configPath)
	if err != nil {
		panic(err)
	}

	js := mewn.String("./frontend/dist/app.js")
	css := mewn.String("./frontend/dist/app.css")

	// app metadata
	app := wails.CreateApp(&wails.AppConfig{
		Width:     1400,
		Height:    900,
		Title:     "amadeus-kasa",
		JS:        js,
		CSS:       css,
		Colour:    "#131313",
		Resizable: true,
	})

	// bind go functions
	// app.Bind(core.ProductGet)

	app.Run()
}
