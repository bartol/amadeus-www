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
