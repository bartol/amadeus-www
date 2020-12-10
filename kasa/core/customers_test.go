package core

import "testing"

func TestCustomerGet(t *testing.T) {
	var cases = []struct {
		customerID int
	}{
		{1},
		{2},
		{3},
		{4},
		{5},
		{50},
	}

	for _, tc := range cases {
		customer, err := CustomerGet(tc.customerID)
		GoldenCheck(t, "customers/CustomerGet", tc, customer, err)
	}
}

func TestCustomerList(t *testing.T) {
	var cases = []struct {
		offset int
		limit  int
	}{
		{0, 2},
		{2, 6},
		{50, 2},
	}

	for _, tc := range cases {
		customers, err := CustomerList(tc.offset, tc.limit)
		GoldenCheck(t, "customers/CustomerList", tc, customers, err)
	}
}

func TestCustomerSearch(t *testing.T) {
	var cases = []struct {
		query  string
		offset int
		limit  int
	}{
		{"vladimira nazora", 0, 50},
		{"vladimira nazora", 1, 1},
		{"vladimira nazora", 50, 50},
		{"ploce", 0, 50},
		{"ploče", 0, 50},
		{"hrvatska", 0, 50},
		{"starcevic", 0, 50},
		{"1234567891", 0, 50}, // oib
		{"0987654321", 0, 50}, // broj
	}

	for _, tc := range cases {
		customers, err := CustomerSearch(tc.query, tc.offset, tc.limit)
		GoldenCheck(t, "customers/CustomerSearch", tc, customers, err)
	}
}
