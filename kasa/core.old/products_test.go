package core

import (
	"bytes"
	"io/ioutil"
	"os"
	"os/exec"
	"strconv"
	"strings"
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
		t.Run("product_"+strconv.Itoa(tc.productID), func(t *testing.T) {
			actual := ProductGet(tc.productID)
			goldenout := "./testdata/products/ProductGet/product_" + strconv.Itoa(tc.productID) + ".out.golden"
			goldenoutfail := "./testdata/products/ProductGet/product_" + strconv.Itoa(tc.productID) + ".outfail.golden"
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
		})
	}
}

func TestProductGetListSlim(t *testing.T) {
	var cases = []struct {
		offset int
		limit  int
	}{
		{0, 2},
		{2, 6},
		{50, 2},
	}

	for _, tc := range cases {
		t.Run("list_"+strconv.Itoa(tc.offset)+"_"+strconv.Itoa(tc.limit), func(t *testing.T) {
			actual := ProductGetListSlim(tc.offset, tc.limit)
			goldenout := "./testdata/products/ProductGetListSlim/list_" + strconv.Itoa(tc.offset) + "_" + strconv.Itoa(tc.limit) + ".out.golden"
			goldenoutfail := "./testdata/products/ProductGetListSlim/list_" + strconv.Itoa(tc.offset) + "_" + strconv.Itoa(tc.limit) + ".outfail.golden"
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
		})
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
		t.Run("product_"+strconv.Itoa(tc.productID), func(t *testing.T) {
			goldenin := "./testdata/products/ProductCreate/product_" + strconv.Itoa(tc.productID) + ".in.golden"
			productin, err := ioutil.ReadFile(goldenin)
			if err != nil {
				t.Fatal(err)
			}
			actual := ProductCreate(string(productin))

			// remove dynamic fields
			cmd := "sed /created_at/d | sed /updated_at/d"
			cmdexec := exec.Command("bash", "-c", cmd)
			cmdexec.Stdin = strings.NewReader(actual)
			out, err := cmdexec.Output()
			if err != nil {
				t.Fatal(err)
			}
			actual = string(out)

			goldenout := "./testdata/products/ProductCreate/product_" + strconv.Itoa(tc.productID) + ".out.golden"
			goldenoutfail := "./testdata/products/ProductCreate/product_" + strconv.Itoa(tc.productID) + ".outfail.golden"
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
		})
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
		t.Run("product_"+strconv.Itoa(tc.productID), func(t *testing.T) {
			goldenin := "./testdata/products/ProductUpdate/product_" + strconv.Itoa(tc.productID) + ".in.golden"
			productin, err := ioutil.ReadFile(goldenin)
			if err != nil {
				t.Fatal(err)
			}
			actual := ProductUpdate(string(productin))

			// remove dynamic fields
			cmd := "sed /updated_at/d"
			cmdexec := exec.Command("bash", "-c", cmd)
			cmdexec.Stdin = strings.NewReader(actual)
			out, err := cmdexec.Output()
			if err != nil {
				t.Fatal(err)
			}
			actual = string(out)

			goldenout := "./testdata/products/ProductUpdate/product_" + strconv.Itoa(tc.productID) + ".out.golden"
			goldenoutfail := "./testdata/products/ProductUpdate/product_" + strconv.Itoa(tc.productID) + ".outfail.golden"
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
		})
	}
}
