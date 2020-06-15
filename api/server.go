package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

var pioneerKey = os.Getenv("PIONEER_API_KEY")
var imageOptimKey = os.Getenv("IMAGEOPTIM_API_KEY")
var imageOptimKeys = strings.Split(imageOptimKey, ",")

func getPioneerURL(resource string) string {
	return "https://" + pioneerKey + "@pioneer.hr/api/" + resource + "/?io_format=JSON&display=full"
}

func getImageOptimURL(imgURL string) string {
	rand.Seed(time.Now().Unix())

	return "https://img.gs/" + imageOptimKeys[rand.Intn(len(imageOptimKeys))] + "/full/" + imgURL
}

func getImagePrivateURL(imgPath string) string {
	return getImageOptimURL("https://" + pioneerKey + "@pioneer.hr/api/images/products/" + imgPath)
}

func getImagePublicURL(productID int, imageID string) string {
	return "https://api.amadeus2.hr/images/" + strconv.Itoa(productID) + "/" + imageID
}

func getBody(URL string) ([]byte, error) {
	resp, err := http.Get(URL)
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

func getCategoryTree(categoriesData getCategoriesResp, ID int) categoryTree {
	name := ""
	slug := ""
	hasProducts := false
	productCount := 0
	children := []categoryTree{}
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

		if c.ID == ID {
			name = c.Name
			slug = c.LinkRewrite
			hasProducts = len(c.Associations.Products) > 0
			productCount = len(c.Associations.Products)
			continue
		}

		if c.ParentID == strconv.Itoa(ID) {
			child := getCategoryTree(categoriesData, c.ID)
			children = append(children, child)
		}
	}
	tree := categoryTree{
		ID:           ID,
		Name:         name,
		Slug:         slug,
		HasProducts:  hasProducts,
		ProductCount: productCount,
		Children:     children,
	}
	return tree
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

type categoryTree struct {
	ID           int
	Name         string
	Slug         string
	HasProducts  bool
	ProductCount int
	Children     []categoryTree
}

type cachedImage struct {
	Body        []byte
	ContentType string
}

var productsMap = make(map[string]product)
var productsLiteSlice []productLite
var categoriesMap = make(map[string]categoryWithProducts)
var categoriesSlice []categoryWithProducts
var categoriesTree []categoryTree
var cachedImages = make(map[string]cachedImage)

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

func reindex() error {
	productsData, err := getProducts()
	if err != nil {
		return err
	}

	specificPricesData, err := getSpecificPrices()
	if err != nil {
		return err
	}

	stockAvailablesData, err := getStockAvailables()
	if err != nil {
		return err
	}

	categoriesData, err := getCategories()
	if err != nil {
		return err
	}

	productFeaturesData, err := getProductFeatures()
	if err != nil {
		return err
	}

	productFeatureValuesData, err := getProductFeatureValues()
	if err != nil {
		return err
	}

	productOptionsData, err := getProductOptions()
	if err != nil {
		return err
	}

	productOptionValuesData, err := getProductOptionValues()
	if err != nil {
		return err
	}

	combinationsData, err := getCombinations()
	if err != nil {
		return err
	}

	productsMap = make(map[string]product)
	productsLiteSlice = []productLite{}
	categoriesMap = make(map[string]categoryWithProducts)
	categoriesSlice = []categoryWithProducts{}
	categoriesTree = []categoryTree{}
	cachedImages = make(map[string]cachedImage)

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
			return err
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
					return err
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
					return err
				}
				quantity = q
				if quantity == 0 {
					outOfStock = true
				}
				break
			}
		}

		defaultImage := image{URL: getImagePublicURL(p.ID, p.DefaultImageID)}

		images := []image{}
		for _, img := range p.Associations.Images {
			image := image{URL: getImagePublicURL(p.ID, img.ID)}
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
					if category.Slug != "amadeus-ii-shop" {
						categories = append(categories, category)
					}
					break
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
					break
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
						return err
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
						return err
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

			if product.ID == 0 {
				continue
			}

			products = append(products, product)
		}

		categories := []category{}
		for _, ctg := range categoriesData.Categories {
			if ctg.ParentID == strconv.Itoa(c.ID) {
				category := category{
					Name: ctg.Name,
					Slug: ctg.LinkRewrite,
				}
				categories = append(categories, category)
			}
		}

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

	categoryTree := getCategoryTree(categoriesData, 25)
	categoriesTree = categoryTree.Children

	return nil
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
	body, err := getBody(getPioneerURL("products"))
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
	body, err := getBody(getPioneerURL("specific_prices"))
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
	body, err := getBody(getPioneerURL("stock_availables"))
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
	body, err := getBody(getPioneerURL("categories"))
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
	body, err := getBody(getPioneerURL("product_features"))
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
	body, err := getBody(getPioneerURL("product_feature_values"))
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
	body, err := getBody(getPioneerURL("product_options"))
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
	body, err := getBody(getPioneerURL("product_option_values"))
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
	body, err := getBody(getPioneerURL("combinations"))
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
	if pioneerKey == "" {
		log.Fatal("add key in PIONEER_API_KEY")
	}
	if imageOptimKey == "" {
		log.Fatal("add key in IMAGEOPTIM_API_KEY")
	}

	log.Println("reindexing...")
	err := reindex()
	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/reindex/", reindexHandler)

	http.HandleFunc("/products/", productsHandler)
	http.HandleFunc("/categories/", categoriesHandler)
	http.HandleFunc("/images/", imagesHandler)

	log.Println("server listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func reindexHandler(w http.ResponseWriter, r *http.Request) {
	err := reindex()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Write([]byte("success"))
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

		err := json.NewEncoder(w).Encode(product)
		if err != nil {
			w.Write([]byte(err.Error()))
		}
		return
	}

	err := json.NewEncoder(w).Encode(productsLiteSlice)
	if err != nil {
		w.Write([]byte(err.Error()))
	}
}

func categoriesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	slug := r.URL.Path[len("/categories/"):]
	if slug == "tree" {
		err := json.NewEncoder(w).Encode(categoriesTree)
		if err != nil {
			w.Write([]byte(err.Error()))
		}
		return
	}

	if slug != "" {
		category, ok := categoriesMap[slug]
		if !ok {
			notFoundHandler(w, r)
			return
		}

		err := json.NewEncoder(w).Encode(category)
		if err != nil {
			w.Write([]byte(err.Error()))
		}
		return
	}

	err := json.NewEncoder(w).Encode(categoriesSlice)
	if err != nil {
		w.Write([]byte(err.Error()))
	}
}

func imagesHandler(w http.ResponseWriter, r *http.Request) {
	imgPath := r.URL.Path[len("/images/"):]
	img, ok := cachedImages[imgPath]
	if ok {
		w.Header().Set("Content-Type", img.ContentType)
		w.Write(img.Body)
		return
	}

	for {
		img, err := http.Get(getImagePrivateURL(imgPath))
		if err != nil {
			w.Write([]byte(err.Error()))
			return
		}
		defer img.Body.Close()

		if img.StatusCode == http.StatusOK {
			contentType := img.Header.Get("Content-Type")
			body, err := ioutil.ReadAll(img.Body)
			if err != nil {
				w.Write([]byte(err.Error()))
				return
			}

			w.Header().Set("Content-Type", contentType)
			w.Write(body)

			cachedImages[imgPath] = cachedImage{
				Body:        body,
				ContentType: contentType,
			}
			return
		}

		if img.StatusCode != http.StatusPaymentRequired {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("404"))
			return
		}
	}
}

func notFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("404"))
}
