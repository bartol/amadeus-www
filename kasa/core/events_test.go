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

			// remove dynamic fields
			cmd := "sed /created_at/d"
			cmdexec := exec.Command("bash", "-c", cmd)
			cmdexec.Stdin = strings.NewReader(actual)
			out, err := cmdexec.Output()
			if err != nil {
				t.Fatal(err)
			}
			actual = string(out)

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
