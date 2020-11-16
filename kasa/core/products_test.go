package core

import (
	"bytes"
	"io/ioutil"
	"os"
	"strconv"
	"testing"
)

func TestProductGet(t *testing.T) {
	var cases = []struct {
		productID int
	}{
		{1},
		{2},
		{3},
		{4},
		{5},
		{50},
	}

	for _, tc := range cases {
		actual := ProductGet(tc.productID)
		goldenout := "./testdata/products/product_" + strconv.Itoa(tc.productID) + ".out.golden"
		goldenoutfail := "./testdata/products/product_" + strconv.Itoa(tc.productID) + ".outfail.golden"
		os.Remove(goldenoutfail)
		if *Update {
			ioutil.WriteFile(goldenout, []byte(actual), 0644)
		}

		expected, err := ioutil.ReadFile(goldenout)
		if err != nil {
			t.Fatal(err)
		}
		if !bytes.Equal([]byte(actual), expected) {
			ioutil.WriteFile(goldenoutfail, []byte(actual), 0644)
			t.Errorf("actual (%s) didn't match golden (%s) ", goldenoutfail, goldenout)
		}
	}
}
