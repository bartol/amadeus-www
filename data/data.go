package data

import "database/sql"

type DB struct {
	*sql.DB
}

type Product struct {
	ID          int
	Name        string
	Prices      []Price
	Categories  []Category
	Description string
	Quantity    int
	ImageURLs   []string
	VideoURL    string
	Features    []Feature
	Slug        string
}

const (
	PriceRegular   = 0
	PriceDiscount  = 1
	PriceWholesale = 2
	PricePurchase  = 3
)

type Price struct {
	Type        int
	Amount      int
	MinQuantity int
}

type Category struct {
	Name             string
	Description      string
	Slug             string
	FeaturedProducts []FeaturedProduct
}

type FeaturedProduct struct {
	Label    string
	Name     string
	ImageURL string
	Price    int
}

type Feature struct {
	Key        string
	Value      string
	Filterable int
}

const (
	NotFilterable = 0
	Filterable    = 1
)

const (
	SortRecommended = 0
	SortCheaper     = 1
	SortExpensive   = 2
	SortNewer       = 3
)
