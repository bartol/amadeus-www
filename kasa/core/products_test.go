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
