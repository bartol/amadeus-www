package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
)

var key = "LFC9PD4UU6FY2KIS32X12RLGHIL1Q9G6"

func getURL(resource string) string {
	return "https://" + key + "@pioneer.hr/api/" + resource + "/?io_format=JSON&display=full&limit=20"
}

type product struct {
	ID            int
	Name          string
	Price         int
	HasReduction  bool
	Reduction     int
	ReductionType string
	OutOfStock    bool
	Quantity      int
	Slug          string
	URL           string
	Description   string
	DefaultImage  image
	Images        []image
	Categories    []category
	Features      []feature
}

type image struct {
	URL string
}

type category struct {
	Name string
}

type feature struct {
	Name     string
	Value    string
	Position int
}

// var products map[string]product

func main() {
	fmt.Println("== start ===============================")

	productsData, err := getProducts()
	if err != nil {
		panic(err)
	}

	specificPricesData, err := getSpecificPrices()
	if err != nil {
		panic(err)
	}

	stockAvailablesData, err := getStockAvailables()
	if err != nil {
		panic(err)
	}

	for _, p := range productsData.Products {
		priceFloat, err := strconv.ParseFloat(p.Price, 10)
		if err != nil {
			panic(err)
		}
		price := int(priceFloat * 100)

		hasReduction := false
		reduction := 0
		reductionType := ""
		for _, sp := range specificPricesData.SpecificPrices {
			if sp.ProductID == strconv.Itoa(p.ID) {
				hasReduction = true
				reductionFloat, err := strconv.ParseFloat(sp.Reduction, 10)
				if err != nil {
					panic(err)
				}
				reduction = int(reductionFloat * 100)
				reductionType = sp.ReductionType
				break
			}
		}

		outOfStock := false
		quantity := 1
		for _, sa := range stockAvailablesData.StockAvailables {
			if sa.ProductID == strconv.Itoa(p.ID) && sa.ProductIDAttribute == "0" {
				quantityInt64, err := strconv.ParseInt(sa.Quantity, 10, 32)
				if err != nil {
					panic(err)
				}
				quantity = int(quantityInt64)
				if quantity == 0 {
					outOfStock = true
				}
			}
		}

		product := product{
			ID:            p.ID,
			Name:          p.Name,
			Price:         price,
			HasReduction:  hasReduction,
			Reduction:     reduction,
			ReductionType: reductionType,
			OutOfStock:    outOfStock,
			Quantity:      quantity,
		}

		fmt.Printf("%+v\n", product)
	}
}

type getProductsResp struct {
	Products []struct {
		ID    int
		Name  string
		Price string
	}
}

func getProducts() (getProductsResp, error) {
	resp, err := http.Get(getURL("products"))
	if err != nil {
		return getProductsResp{}, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return getProductsResp{}, err
	}

	data := getProductsResp{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return getProductsResp{}, err
	}

	return data, nil
}

type getSpecificPricesResp struct {
	SpecificPrices []struct {
		ProductID     string `json:"id_product"`
		Reduction     string
		ReductionType string `json:"reduction_type"`
	} `json:"specific_prices"`
}

func getSpecificPrices() (getSpecificPricesResp, error) {
	resp, err := http.Get(getURL("specific_prices"))
	if err != nil {
		return getSpecificPricesResp{}, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return getSpecificPricesResp{}, err
	}

	data := getSpecificPricesResp{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return getSpecificPricesResp{}, err
	}

	return data, nil
}

type getStockAvailablesResp struct {
	StockAvailables []struct {
		ProductID          string `json:"id_product"`
		ProductIDAttribute string `json:"id_product_attribute"`
		Quantity           string
	} `json:"stock_availables"`
}

func getStockAvailables() (getStockAvailablesResp, error) {
	fmt.Println(getURL("stock_availables"))
	resp, err := http.Get(getURL("stock_availables"))
	if err != nil {
		return getStockAvailablesResp{}, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return getStockAvailablesResp{}, err
	}

	data := getStockAvailablesResp{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return getStockAvailablesResp{}, err
	}

	return data, nil
}
