package core

import "testing"

func TestBrandGet(t *testing.T) {
	var cases = []struct {
		brandID int
	}{
		{1},
		{2},
		{50},
	}

	for _, tc := range cases {
		brand, err := BrandGet(tc.brandID)
		GoldenCheck(t, "brands/BrandGet", tc, brand, err)
	}
}

func TestBrandList(t *testing.T) {
	var cases = []struct {
		goldenFileName string
	}{
		{"list"},
	}

	for _, tc := range cases {
		brands, err := BrandList()
		GoldenCheck(t, "brands/BrandList", tc, brands, err)
	}
}
