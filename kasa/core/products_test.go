package core

import (
	"testing"
)

func TestProductGet(t *testing.T) {
	var cases = []struct {
		productID int
		light     bool
	}{
		{1, true},
		{2, true},
		{3, true},
		{4, true},
		{5, true},
		{50, true},
		{1, false},
		{2, false},
		{3, false},
		{4, false},
		{5, false},
		{50, false},
	}

	for _, tc := range cases {
		product, err := ProductGet(tc.productID, tc.light)
		GoldenCheck(t, "products/ProductGet", tc, product, err)
	}
}

func TestProductList(t *testing.T) {
	var cases = []struct {
		offset int
		limit  int
	}{
		{0, 2},
		{2, 6},
		{50, 2},
	}

	for _, tc := range cases {
		products, err := ProductList(tc.offset, tc.limit)
		GoldenCheck(t, "products/ProductList", tc, products, err)
	}
}

func TestProductCreate(t *testing.T) {
	var cases = []struct {
		productID int
	}{
		{6},
		{7},
		{8},
		{9},
		{10},
		{11},
	}

	for _, tc := range cases {
		data := GoldenGet(t, "products/ProductCreate", tc)
		product, err := ProductCreate(data)
		RemoveDateFields(&product)
		GoldenCheck(t, "products/ProductCreate", tc, product, err)
	}
}

func TestProductUpdate(t *testing.T) {
	var cases = []struct {
		productID int
	}{
		{1},
		{2},
		{3},
		{4},
		{5},
		{6},
		{7},
		{8},
		{50},
	}

	for _, tc := range cases {
		data := GoldenGet(t, "products/ProductUpdate", tc)
		product, err := ProductUpdate(data)
		RemoveDateFields(&product)
		GoldenCheck(t, "products/ProductUpdate", tc, product, err)
	}
}
