package data

type Product struct {
	ID          int
	Name        string
	Prices      []Price
	Categories  []Category
	Description string
	Quantity    int
	ImageURLs   []string
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
	Filterable bool
}

const (
	SortRecommended = 0
	SortCheaper     = 1
	SortExpensive   = 2
	SortNewer       = 3
)

func ProductGet(slug string) (Product, error) {
	return Product{}, nil
}

func ProductList(filters map[string]string) ([]Product, error) {
	// filters: query, category_slug, feature, sort, page, price_min, price_max
	return []Product{}, nil
}

func CategoryGet(slug string) (Category, error) {
	return Category{}, nil
}
