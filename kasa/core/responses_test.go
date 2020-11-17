package core

import (
	"bytes"
	"errors"
	"io/ioutil"
	"os"
	"strconv"
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

func TestResponseFailure(t *testing.T) {
	var cases = []struct {
		status  int
		message string
		err     error
	}{
		{400, "Proizvod mora imati ime", nil},
		{404, "Proizvod nije pronađen", errors.New("pg: row not found")},
		{500, "Pogreška pri deserializaciji zahtjeva", errors.New("json: can't parse this")},
	}

	for _, tc := range cases {
		t.Run(strconv.Itoa(tc.status), func(t *testing.T) {
			actual := ResponseFailure(tc.status, tc.message, tc.err)
			goldenout := "./testdata/responses/ResponseFailure/" + strconv.Itoa(tc.status) + ".out.golden"
			goldenoutfail := "./testdata/responses/ResponseFailure/" + strconv.Itoa(tc.status) + ".outfail.golden"
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
