package core

import "testing"

func TestCategoryGet(t *testing.T) {
	var cases = []struct {
		categoryID int
	}{
		{1},
		{2},
		{50},
	}

	for _, tc := range cases {
		category, err := CategoryGet(tc.categoryID)
		GoldenCheck(t, "categories/CategoryGet", tc, category, err)
	}
}
