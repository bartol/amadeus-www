package core

import "testing"

func TestPublicationList(t *testing.T) {
	var cases = []struct {
		list string
	}{
		{"list"},
	}

	for _, tc := range cases {
		publications, err := PublicationList()
		GoldenCheck(t, "publications/PublicationList", tc, publications, err)
	}
}
