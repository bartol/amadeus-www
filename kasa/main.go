package main

import (
  "amadeus-kasa/core"
  "fmt"
  "log"

  "github.com/leaanthony/mewn"
  "github.com/wailsapp/wails"
)

func basic() string {
  return "Hello World!"
}

func main() {
  err := core.SetupEnv()
  if err != nil {
    log.Fatalln(err)
  }

  js := mewn.String("./frontend/dist/app.js")
  css := mewn.String("./frontend/dist/app.css")

  app := wails.CreateApp(&wails.AppConfig{
    Width:     1400,
    Height:    900,
    Title:     "amadeus-kasa",
    JS:        js,
    CSS:       css,
    Colour:    "#131313",
    Resizable: true,
  })
  fmt.Println(core.ProductGet(1))
  fmt.Println(core.ProductGet(2))
  fmt.Println(core.ProductGet(4))
  fmt.Println(core.ProductGet(6))
  fmt.Println("--------")
  fmt.Println(core.ProductGetList(6, 0))
  fmt.Println(core.ProductGetList(2, 0))
  fmt.Println(core.ProductGetList(2, 2))
  fmt.Println(core.ProductGetList(2, 8))
  app.Bind(basic)
  app.Bind(core.ProductGet)
  app.Run()
}
