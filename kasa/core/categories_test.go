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

func TestCategoryList(t *testing.T) {
	var cases = []struct {
		list string
	}{
		{"list"},
	}

	for _, tc := range cases {
		categories, err := CategoryList()
		GoldenCheck(t, "categories/CategoryList", tc, categories, err)
	}
}

func TestCategoryCreate(t *testing.T) {
	var cases = []struct {
		categoryID int
	}{
		{6},
		{7},
		{8},
	}

	for _, tc := range cases {
		data := GoldenGet(t, "categories/CategoryCreate", tc)
		category, err := CategoryCreate(data)
		GoldenCheck(t, "categories/CategoryCreate", tc, category, err)
	}
}
