package main

import (
  "github.com/leaanthony/mewn"
  "github.com/wailsapp/wails"
  "amadeus-kasa/core"
)

func basic() string {
  return "Hello World!"
}

func main() {

  js := mewn.String("./frontend/dist/app.js")
  css := mewn.String("./frontend/dist/app.css")

  app := wails.CreateApp(&wails.AppConfig{
    Width:  1400,
    Height: 900,
    Title:  "amadeus-kasa",
    JS:     js,
    CSS:    css,
    Colour: "#131313",
    Resizable: true,
  })
  app.Bind(basic)
  app.Bind(core.ProductFunc)
  app.Run()
}
