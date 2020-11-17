package core

import (
	"bytes"
	"io/ioutil"
	"os"
	"strconv"
	"testing"
)

func TestEventGet(t *testing.T) {
	var cases = []struct {
		eventID int
	}{
		{1},
		{2},
		{3},
		{50},
	}

	for _, tc := range cases {
		t.Run("event_"+strconv.Itoa(tc.eventID), func(t *testing.T) {
			actual := EventGet(tc.eventID)
			goldenout := "./testdata/events/EventGet/event_" + strconv.Itoa(tc.eventID) + ".out.golden"
			goldenoutfail := "./testdata/events/EventGet/event_" + strconv.Itoa(tc.eventID) + ".outfail.golden"
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

func TestEventGetList(t *testing.T) {
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
			actual := EventGetList(tc.offset, tc.limit)
			goldenout := "./testdata/events/EventGetList/list_" + strconv.Itoa(tc.offset) + "_" + strconv.Itoa(tc.limit) + ".out.golden"
			goldenoutfail := "./testdata/events/EventGetList/list_" + strconv.Itoa(tc.offset) + "_" + strconv.Itoa(tc.limit) + ".outfail.golden"
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
