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
		list string
	}{
		{"list"},
	}

	for _, tc := range cases {
		brands, err := BrandList()
		GoldenCheck(t, "brands/BrandList", tc, brands, err)
	}
}

func TestBrandCreate(t *testing.T) {
	var cases = []struct {
		brandID int
	}{
		{6},
		{7},
		{8},
	}

	for _, tc := range cases {
		data := GoldenGet(t, "brands/BrandCreate", tc)
		brand, err := BrandCreate(data)
		GoldenCheck(t, "brands/BrandCreate", tc, brand, err)
	}
}

func TestBrandUpdate(t *testing.T) {
	var cases = []struct {
		brandID int
	}{
		{1},
		{2},
		{50},
	}

	for _, tc := range cases {
		data := GoldenGet(t, "brands/BrandUpdate", tc)
		brand, err := BrandUpdate(data)
		GoldenCheck(t, "brands/BrandUpdate", tc, brand, err)
	}
}
