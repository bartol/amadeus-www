package core

import (
	"bytes"
	"io/ioutil"
	"os"
	"testing"
)

func TestResponseSuccess(t *testing.T) {
	var cases = []struct {
		name string
		data interface{}
	}{
		{"product", Product{}},
		{"product_slim", ProductSlim{}},
		{"text", "str"},
		{"number", 2},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			actual := ResponseSuccess(tc.data)
			goldenout := "./testdata/responses/ResponseSuccess/" + tc.name + ".out.golden"
			goldenoutfail := "./testdata/responses/ResponseSuccess/" + tc.name + ".outfail.golden"
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
