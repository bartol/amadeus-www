package core

import (
	"bytes"
	"io/ioutil"
	"os"
	"strconv"
	"testing"
)

func TestProductFeatureGet(t *testing.T) {
	var cases = []struct {
		featureID int
	}{
		{1},
		{2},
		{3},
		{4},
		{50},
	}

	for _, tc := range cases {
		t.Run("feature_"+strconv.Itoa(tc.featureID), func(t *testing.T) {
			actual := ProductFeatureGet(tc.featureID)
			goldenout := "./testdata/product_features/ProductFeatureGet/feature_" + strconv.Itoa(tc.featureID) + ".out.golden"
			goldenoutfail := "./testdata/product_features/ProductFeatureGet/feature_" + strconv.Itoa(tc.featureID) + ".outfail.golden"
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

func TestProductFeatureGetList(t *testing.T) {
	actual := ProductFeatureGetList()
	goldenout := "./testdata/product_features/ProductFeatureGetList/list.out.golden"
	goldenoutfail := "./testdata/product_features/ProductFeatureGetList/list.outfail.golden"
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

func TestProductFeatureCreate(t *testing.T) {
	var cases = []struct {
		productFeatureID int
	}{
		{5},
		{6},
		{7},
	}

	for _, tc := range cases {
		t.Run("feature_"+strconv.Itoa(tc.productFeatureID), func(t *testing.T) {
			goldenin := "./testdata/product_features/ProductFeatureCreate/feature_" + strconv.Itoa(tc.productFeatureID) + ".in.golden"
			productin, err := ioutil.ReadFile(goldenin)
			if err != nil {
				t.Fatal(err)
			}
			actual := ProductFeatureCreate(string(productin))

			goldenout := "./testdata/product_features/ProductFeatureCreate/feature_" + strconv.Itoa(tc.productFeatureID) + ".out.golden"
			goldenoutfail := "./testdata/product_features/ProductFeatureCreate/feature_" + strconv.Itoa(tc.productFeatureID) + ".outfail.golden"
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

func TestProductFeatureUpdate(t *testing.T) {
	var cases = []struct {
		productFeatureID int
	}{
		{2},
		{3},
		{4},
		{50},
	}

	for _, tc := range cases {
		t.Run("feature_"+strconv.Itoa(tc.productFeatureID), func(t *testing.T) {
			goldenin := "./testdata/product_features/ProductFeatureUpdate/feature_" + strconv.Itoa(tc.productFeatureID) + ".in.golden"
			productin, err := ioutil.ReadFile(goldenin)
			if err != nil {
				t.Fatal(err)
			}
			actual := ProductFeatureUpdate(string(productin))

			goldenout := "./testdata/product_features/ProductFeatureUpdate/feature_" + strconv.Itoa(tc.productFeatureID) + ".out.golden"
			goldenoutfail := "./testdata/product_features/ProductFeatureUpdate/feature_" + strconv.Itoa(tc.productFeatureID) + ".outfail.golden"
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
