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
	return "https://" + key + "@pioneer.hr/api/" + resource + "/?io_format=JSON&display=full"
}

func getImageURL(productID int, imageID string) string {
	return "https://pioneer.hr/api/images/products/" + strconv.Itoa(productID) + "/" + imageID
}

func getBody(url string) ([]byte, error) {
	resp, err := http.Get(url)
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

func reverseCategories(a []category) []category {
	for i := len(a)/2 - 1; i >= 0; i-- {
		opp := len(a) - 1 - i
		a[i], a[opp] = a[opp], a[i]
	}
	return a
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
	Options       []option
}

type productLite struct {
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
	DefaultImage  image
	Categories    []category
	Features      []feature
}

type image struct {
	URL string
}

type category struct {
	Name string
	Slug string
}

type feature struct {
	Name  string
	Value string
}

type option struct {
	Name       string
	Value      string
	Price      int
	OutOfStock bool
	Quantity   int
}

type categoryWithProducts struct {
	ID         int
	Name       string
	Slug       string
	Image      image
	Products   []productLite
	Categories []category
}

var productsMap = make(map[string]product)
var productsLiteSlice []productLite
var categoriesMap = make(map[string]categoryWithProducts)
var categoriesSlice []categoryWithProducts

var blacklistedCategories = []string{
	"1",  // Root
	"2",  // Home
	"12", // USB Player
	"13", // Controller / Combo DJ System
	"14", // Headphones
	"15", // Turntable
	"16", // Player
	"17", // Mixer
	"18", // Controller Bag / Flight Case
	"19", // Zvučnici (kom)
	"20", // Dodaci
	"21", // Remix Station
	"22", // All In One Systems
	"23", // XPRS zvučnici
	"24", // Rasprodaja
	"31", // Elektronika
	"37", // Digitalni prijamnici
	"78", // Effector
	"83", // Hi-Fi
	"84", // Mini linije
	"85", // BT zvučnici/karaoke
	"88", // Slušalice
	"89", // Bežične slušalice
	"90", // Zvučnici
}

func reindex() {
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

	categoriesData, err := getCategories()
	if err != nil {
		panic(err)
	}

	productFeaturesData, err := getProductFeatures()
	if err != nil {
		panic(err)
	}

	productFeatureValuesData, err := getProductFeatureValues()
	if err != nil {
		panic(err)
	}

	productOptionsData, err := getProductOptions()
	if err != nil {
		panic(err)
	}

	productOptionValuesData, err := getProductOptionValues()
	if err != nil {
		panic(err)
	}

	combinationsData, err := getCombinations()
	if err != nil {
		panic(err)
	}

	for _, p := range productsData.Products {
		isAmadeus := true
		for _, c := range blacklistedCategories {
			if c == p.Associations.Categories[len(p.Associations.Categories)-1].ID {
				isAmadeus = false
			}
		}
		if !isAmadeus {
			continue
		}

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
			if sa.ProductID == strconv.Itoa(p.ID) && sa.ProductAttributeID == "0" {
				q, err := strconv.Atoi(sa.Quantity)
				if err != nil {
					panic(err)
				}
				quantity = q
				if quantity == 0 {
					outOfStock = true
				}
				break
			}
		}

		defaultImage := image{URL: getImageURL(p.ID, p.DefaultImageID)}

		images := []image{}
		for _, img := range p.Associations.Images {
			image := image{URL: getImageURL(p.ID, img.ID)}
			images = append(images, image)
		}

		categories := []category{}
		for _, categoryFromAssociations := range p.Associations.Categories {
			for _, categoryFromData := range categoriesData.Categories {
				if categoryFromAssociations.ID == strconv.Itoa(categoryFromData.ID) {
					category := category{
						Name: categoryFromData.Name,
						Slug: categoryFromData.LinkRewrite,
					}
					categories = append(categories, category)
				}
			}
		}

		URL := categories[len(categories)-1].Slug + "/" + p.LinkRewrite

		features := []feature{}
		for _, featureFromAssociations := range p.Associations.ProductFeatures {
			for _, featureFromData := range productFeaturesData.ProductFeatures {
				if featureFromAssociations.ID == strconv.Itoa(featureFromData.ID) {
					value := ""
					for _, featureValue := range productFeatureValuesData.ProductFeatureValues {
						if featureFromAssociations.ValueID == strconv.Itoa(featureValue.ID) {
							value = featureValue.Value
							break
						}
					}
					feature := feature{
						Name:  featureFromData.Name,
						Value: value,
					}
					features = append(features, feature)
				}
			}
		}

		options := []option{}
		for _, sa := range p.Associations.StockAvailables {
			if sa.ProductAttributeID == "0" {
				continue
			}

			v := ""
			n := ""
			pr := 0

			for _, combination := range combinationsData.Combinations {
				if sa.ProductAttributeID == strconv.Itoa(combination.ID) {
					for _, optionValue := range productOptionValuesData.ProductOptionValues {
						if combination.Associations.ProductOptionValues[0].ID == strconv.Itoa(optionValue.ID) {
							v = optionValue.Value

							for _, option := range productOptionsData.ProductOptions {
								if optionValue.ProductOptionID == strconv.Itoa(option.ID) {
									n = option.Name
									break
								}
							}
							break
						}
					}

					pFloat, err := strconv.ParseFloat(combination.Price, 10)
					if err != nil {
						panic(err)
					}
					pr = int(pFloat * 100)
					break
				}
			}

			q := 0
			s := false
			for _, sad := range stockAvailablesData.StockAvailables {
				if sa.ID == strconv.Itoa(sad.ID) {
					qu, err := strconv.Atoi(sad.Quantity)
					if err != nil {
						panic(err)
					}
					q = qu
					if q == 0 {
						s = true
					}
					break
				}
			}

			option := option{
				Name:       n,
				Value:      v,
				Price:      pr,
				OutOfStock: s,
				Quantity:   q,
			}
			options = append(options, option)
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
			Slug:          p.LinkRewrite,
			URL:           URL,
			Description:   p.Description,
			DefaultImage:  defaultImage,
			Images:        images,
			Categories:    categories,
			Features:      features,
			Options:       options,
		}

		productsMap[URL] = product

		productLite := productLite{
			ID:            p.ID,
			Name:          p.Name,
			Price:         price,
			HasReduction:  hasReduction,
			Reduction:     reduction,
			ReductionType: reductionType,
			OutOfStock:    outOfStock,
			Quantity:      quantity,
			Slug:          p.LinkRewrite,
			URL:           URL,
			DefaultImage:  defaultImage,
			Categories:    categories,
			Features:      features,
		}

		productsLiteSlice = append(productsLiteSlice, productLite)
	}

	for _, c := range categoriesData.Categories {
		isAmadeus := true
		for _, blc := range blacklistedCategories {
			if blc == strconv.Itoa(c.ID) {
				isAmadeus = false
			}
		}
		if !isAmadeus {
			continue
		}

		image := image{
			URL: "", // TODO
		}

		products := []productLite{}
		for _, p := range c.Associations.Products {
			var product productLite
			for _, pl := range productsLiteSlice {
				if p.ID == strconv.Itoa(pl.ID) {
					product = pl
					break
				}
			}
			products = append(products, product)
		}

		categories := []category{}
		var getCategory func(string)
		getCategory = func(id string) {
			var ctg category
			var parentID string
			for _, ct := range categoriesData.Categories {
				if id == strconv.Itoa(ct.ID) {
					ctg = category{
						Name: ct.Name,
						Slug: ct.LinkRewrite,
					}
					parentID = ct.ParentID
					break
				}
			}

			if ctg.Slug != "amadeus-ii-shop" {
				categories = append(categories, ctg)
			}

			if parentID != "1" {
				getCategory(parentID)
			}
		}
		getCategory(strconv.Itoa(c.ID))
		categories = reverseCategories(categories)

		category := categoryWithProducts{
			ID:         c.ID,
			Name:       c.Name,
			Slug:       c.LinkRewrite,
			Image:      image,
			Products:   products,
			Categories: categories,
		}

		categoriesMap[category.Slug] = category
		categoriesSlice = append(categoriesSlice, category)
	}
}

type getProductsResp struct {
	Products []struct {
		ID             int
		Name           string
		Price          string
		LinkRewrite    string `json:"link_rewrite"`
		Description    string
		DefaultImageID string `json:"id_default_image"`
		Associations   struct {
			Images []struct {
				ID string
			}
			Categories []struct {
				ID string
			}
			ProductFeatures []struct {
				ID      string
				ValueID string `json:"id_feature_value"`
			} `json:"product_features"`
			StockAvailables []struct {
				ID                 string
				ProductAttributeID string `json:"id_product_attribute"`
			} `json:"stock_availables"`
		}
	}
}

func getProducts() (getProductsResp, error) {
	body, err := getBody(getURL("products"))
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
	body, err := getBody(getURL("specific_prices"))
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
		ID                 int
		ProductID          string `json:"id_product"`
		ProductAttributeID string `json:"id_product_attribute"`
		Quantity           string
	} `json:"stock_availables"`
}

func getStockAvailables() (getStockAvailablesResp, error) {
	body, err := getBody(getURL("stock_availables"))
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

type getCategoriesResp struct {
	Categories []struct {
		ID           int
		ParentID     string `json:"id_parent"`
		Name         string
		LinkRewrite  string `json:"link_rewrite"`
		Associations struct {
			Products []struct {
				ID string
			}
		}
	}
}

func getCategories() (getCategoriesResp, error) {
	body, err := getBody(getURL("categories"))
	if err != nil {
		return getCategoriesResp{}, err
	}

	data := getCategoriesResp{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return getCategoriesResp{}, err
	}

	return data, nil
}

type getProductFeaturesResp struct {
	ProductFeatures []struct {
		ID   int
		Name string
	} `json:"product_features"`
}

func getProductFeatures() (getProductFeaturesResp, error) {
	body, err := getBody(getURL("product_features"))
	if err != nil {
		return getProductFeaturesResp{}, err
	}

	data := getProductFeaturesResp{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return getProductFeaturesResp{}, err
	}

	return data, nil
}

type getProductFeatureValuesResp struct {
	ProductFeatureValues []struct {
		ID    int
		Value string
	} `json:"product_feature_values"`
}

func getProductFeatureValues() (getProductFeatureValuesResp, error) {
	body, err := getBody(getURL("product_feature_values"))
	if err != nil {
		return getProductFeatureValuesResp{}, err
	}

	data := getProductFeatureValuesResp{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return getProductFeatureValuesResp{}, err
	}

	return data, nil
}

type getProductOptionResp struct {
	ProductOptions []struct {
		ID   int
		Name string
	} `json:"product_options"`
}

func getProductOptions() (getProductOptionResp, error) {
	body, err := getBody(getURL("product_options"))
	if err != nil {
		return getProductOptionResp{}, err
	}

	data := getProductOptionResp{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return getProductOptionResp{}, err
	}

	return data, nil
}

type getProductOptionValuesResp struct {
	ProductOptionValues []struct {
		ID              int
		ProductOptionID string `json:"id_attribute_group"`
		Value           string `json:"name"`
	} `json:"product_option_values"`
}

func getProductOptionValues() (getProductOptionValuesResp, error) {
	body, err := getBody(getURL("product_option_values"))
	if err != nil {
		return getProductOptionValuesResp{}, err
	}

	data := getProductOptionValuesResp{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return getProductOptionValuesResp{}, err
	}

	return data, nil
}

type getCombinationsResp struct {
	Combinations []struct {
		ID           int
		Price        string
		Associations struct {
			ProductOptionValues []struct {
				ID string
			} `json:"product_option_values"`
		}
	}
}

func getCombinations() (getCombinationsResp, error) {
	body, err := getBody(getURL("combinations"))
	if err != nil {
		return getCombinationsResp{}, err
	}

	data := getCombinationsResp{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return getCombinationsResp{}, err
	}

	return data, nil
}

func main() {
	fmt.Println("reindexing...")
	reindex()

	http.HandleFunc("/products/", productsHandler)
	http.HandleFunc("/categories/", categoriesHandler)

	fmt.Println("server listening on :8080")
	http.ListenAndServe(":8080", nil)
}

func productsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	URL := r.URL.Path[len("/products/"):]
	if URL != "" {
		product, ok := productsMap[URL]
		if !ok {
			notFoundHandler(w, r)
			return
		}

		json.NewEncoder(w).Encode(product)
		return
	}

	json.NewEncoder(w).Encode(productsLiteSlice)
}

func categoriesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	slug := r.URL.Path[len("/categories/"):]
	if slug != "" {
		category, ok := categoriesMap[slug]
		if !ok {
			notFoundHandler(w, r)
			return
		}

		json.NewEncoder(w).Encode(category)
		return
	}

	json.NewEncoder(w).Encode(categoriesSlice)
}

func notFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("404"))
}
