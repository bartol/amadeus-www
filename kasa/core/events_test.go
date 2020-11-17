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

func TestEventCreate(t *testing.T) {
	var cases = []struct {
		eventID int
	}{
		{4},
		{5},
		{6},
		{7},
	}

	for _, tc := range cases {
		t.Run("event_"+strconv.Itoa(tc.eventID), func(t *testing.T) {
			goldenin := "./testdata/events/EventCreate/event_" + strconv.Itoa(tc.eventID) + ".in.golden"
			eventin, err := ioutil.ReadFile(goldenin)
			if err != nil {
				t.Fatal(err)
			}
			actual := EventCreate(string(eventin))

			// remove dynamic fields
			cmd := "sed /created_at/d"
			cmdexec := exec.Command("bash", "-c", cmd)
			cmdexec.Stdin = strings.NewReader(actual)
			out, err := cmdexec.Output()
			if err != nil {
				t.Fatal(err)
			}
			actual = string(out)

			goldenout := "./testdata/events/EventCreate/event_" + strconv.Itoa(tc.eventID) + ".out.golden"
			goldenoutfail := "./testdata/events/EventCreate/event_" + strconv.Itoa(tc.eventID) + ".outfail.golden"
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
