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
