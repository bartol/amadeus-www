package data

import "github.com/jmoiron/sqlx"

type DB struct {
	*sqlx.DB
}

type Product struct {
	RowID       int
	Name        string
	Prices      []Price
	Categories  []Category
	Description string
	Quantity    int
	Images      []string
	Video       string
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
	RowID            int
	Name             string
	Slug             string
	Description      string
	FeaturedProducts []FeaturedProduct
}

type FeaturedProduct struct {
	Label string
	Name  string
	Image string
	Price int
}

type Feature struct {
	Key   string
	Value string
}

const (
	SortRecommended = 0
	SortCheaper     = 1
	SortExpensive   = 2
	SortNewer       = 3
)
