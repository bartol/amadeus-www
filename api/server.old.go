package main

import (
	"fmt"
	"sync"
)

type Item struct {
	ID          int
	Name        string
	Slug        string
	Price       int
	Description string
}

var data map[string]Item

func getApiURL(resource, id string) string {
	return "https://" + key + "@pioneer.hr/api/" + resource + "/" + id + "?io_format=JSON"
}

var wg sync.WaitGroup

func main() {
	wg.Add(1)
	go reindex("25")
	wg.Wait()
	fmt.Println(products)
	fmt.Println(len(products))

	// http.HandleFunc("/proizvod/", productHandler)

	// log.Fatal(http.ListenAndServe(":8080", nil))
}

// func productHandler(w http.ResponseWriter, r *http.Request) {
// 	product := r.URL.Path[len("/proizvod/"):]
// 	if product == "" {
// 		productIndexHandler(w, r)
// 	}

// 	// w.Write([]byte(p	roduct))
// }

// func productIndexHandler(w http.ResponseWriter, r *http.Request) {
// 	w.Write([]byte("products"))
// }

var key = "LFC9PD4UU6FY2KIS32X12RLGHIL1Q9G6"

type getProductResp struct {
	Product struct {
		ID          int    `json:"id"`
		Name        string `json:"name"`
		Description string `json:"description"`
	} `json:"product"`
}

type getProductResp struct {
	Product struct {
		ID          int    `json:"id"`
		Name        string `json:"name"`
		Description string `json:"description"`
	} `json:"product"`
}

// type getCategoryResp struct {
// 	Category struct {
// 		Associations struct {
// 			Categories []struct {
// 				ID string
// 			} `json:"categories"`
// 			Products []struct {
// 				ID string
// 			} `json:"products"`
// 		} `json:"associations"`
// 	} `json:"category"`
// }

// type Product struct{}

// func getCategory(id string) (getCategoryResp, error) {
// 	fmt.Println(getApiURL("categories", id))
// 	resp, err := http.Get(getApiURL("categories", id))
// 	if err != nil {
// 		return getCategoryResp{}, err
// 	}
// 	defer resp.Body.Close()

// 	body, err := ioutil.ReadAll(resp.Body)
// 	category := getCategoryResp{}
// 	err = json.Unmarshal(body, &category)
// 	if err != nil {
// 		return getCategoryResp{}, err
// 	}

// 	return category, nil
// }

// func getProduct(id string) (getProductResp, error) {
// 	resp, err := http.Get(getApiURL("products", id))
// 	if err != nil {
// 		return getProductResp{}, err
// 	}
// 	defer resp.Body.Close()

// 	body, err := ioutil.ReadAll(resp.Body)
// 	product := getProductResp{}
// 	err = json.Unmarshal(body, &product)
// 	if err != nil {
// 		return getProductResp{}, err
// 	}

// 	return product, nil
// }

// var products []struct {
// 	ID string
// }

// func reindex(id string) {
// 	defer wg.Done()
// 	category, err := getCategory(id)
// 	if err != nil {
// 		fmt.Print(err.Error())
// 		return
// 	}
// 	products = append(products, category.Category.Associations.Products...)

// 	for i := 0; i < len(category.Category.Associations.Categories); i++ {
// 		category := category.Category.Associations.Categories[i]
// 		wg.Add(1)
// 		go reindex(category.ID)
// 	}
// }

/*
func getBody(resource, id string) ([]byte, error) {
	resp, err := http.Get(getURL(resource, id))
	if err != nil {
		return []byte(""), err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return []byte(""), err
	}

	return body, nil
}

type getCategoryResp struct {
	Category struct {
		Associations struct {
			Categories []struct {
				ID string
			}
			Products []struct {
				ID string
			}
		}
	}
}

func getCategory(id string, products *[]string) {
	body, err := getBody("categories", id)
	if err != nil {
		panic(err)
	}

	category := getCategoryResp{}
	err = json.Unmarshal(body, &category)
	if err != nil {
		fmt.Println(string(body))
		panic(err.Error())
	}

	mux.Lock()
	for _, product := range category.Category.Associations.Products {
		*products = append(*products, product.ID)
	}
	mux.Unlock()

	for _, category := range category.Category.Associations.Categories {
		time.Sleep(500 * time.Millisecond)
		wg.Add(1)
		go getCategory(category.ID, products)
	}
}

var wg sync.WaitGroup
var mux sync.Mutex
*/
