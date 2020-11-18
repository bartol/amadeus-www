package core

import (
	"bytes"
	"io/ioutil"
	"os"
	"testing"
)

func TestPublicationGetList(t *testing.T) {
	actual := PublicationGetList()
	goldenout := "./testdata/publications/PublicationGetList/list.out.golden"
	goldenoutfail := "./testdata/publications/PublicationGetList/list.outfail.golden"
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
