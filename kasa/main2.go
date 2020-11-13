package main

import (
  "amadeus-kasa/core"
  "fmt"
  "log"
)

func main() {
  err := core.SetupEnv()
  if err != nil {
    log.Fatalln(err)
  }

  // fmt.Println(ProductUpdate(1))

  // fmt.Println(core.ProductGet(1))
  // fmt.Println(core.ProductGet(2))
  // fmt.Println(core.ProductGet(4))
  // fmt.Println(core.ProductGet(6))
  // fmt.Println("--------")
  // fmt.Println(core.ProductGetListSlim(0, 6))
  // fmt.Println(core.ProductGetListSlim(0, 2))
  // fmt.Println(core.ProductGetListSlim(2, 2))
  // fmt.Println(core.ProductGetListSlim(8, 2))

  //product_id
  //url
  //created_at
  //updated_at
  fmt.Println(core.ProductUpdate(`
  {
    "product_id": 11,
    "name": "43332Lenovo ideapad L340-15API, 81LW0047SC",
    "price": 389900,
    "discount": 135000,
    "quantity": 1,
    "description": "Lenovo ideapad L340-15API, 81LW0047SC, 15.6\" FHD (1920x1080) TN 220nits Anti-glare, AMD...",
    "url": "lenovo-ideapad-l340-15api-81lw0047sc",
    "recommended": false,
    "created_at": "2020-10-12T17:13:54.287936Z",
    "updated_at": "2020-10-15T17:13:54.287936Z",
    "brand": "Lenovo2",
    "brand_id": 0,
    "category": "Laptopi2",
    "category_id": 0,
    "product_features": [
      {
        "product_id": 4,
        "product_feature_id": 1,
        "product_feature_value_id": 3,
        "category_id": 1,
        "name": "Procesor",
        "value": "AMD Ryzen 3 3200U (2C / 4T, 2.6 / 3.5GHz, 1MB L2 / 4MB L3)",
        "recommended": true
      },
      {
        "product_id": 4,
        "product_feature_id": 0,
        "product_feature_value_id": 4,
        "category_id": 1,
        "name": "####OS#",
        "value": "Free DOS",
        "recommended": false
      }
    ],
    "product_publications": [
      {
        "product_id": 4,
        "publication_id": 1,
        "product_publication_id": 2,
        "name": "amadeus2.hr"
      }
    ],
    "product_recommendations": [
      {
        "product_id": 2,
        "name": "Dell Inspiron 5482 2in1, I5I507-273182898",
        "price": 649900,
        "discount": 60000,
        "quantity": 1,
        "url": "dell-inspiron-5482-2in1-i5i507-273182898",
        "recommended": false,
        "created_at": "2020-10-12T17:13:54.287936Z",
        "updated_at": "2020-10-13T17:13:54.287936Z",
        "brand": "Dell",
        "category": "Laptopi"
      },
      {
        "product_id": 3,
        "name": "HP 250 G7 6BP58EA (15.6, i3, 8GB RAM, 256GB SSD, Intel HD, Win10p)",
        "price": 529900,
        "discount": 80000,
        "quantity": 0,
        "url": "hp-250-g7-6bp58ea-156-i3-8gb-ram-256gb-ssd-intel-hd-win10p",
        "recommended": false,
        "created_at": "2020-10-12T17:13:54.287936Z",
        "updated_at": "2020-10-14T17:13:54.287936Z",
        "brand": "HP",
        "category": "Laptopi"
      }
    ]
  }
      `))
}
