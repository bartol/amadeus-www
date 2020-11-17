package core

import (
	"testing"
)

func TestURLify(t *testing.T) {
	var cases = []struct {
		in  string
		out string
	}{
		{"PlayStation 4 500GB F Chassis Black", "playstation-4-500gb-f-chassis-black"},
		{"Dell Inspiron 5482 2in1, I5I507-273182898", "dell-inspiron-5482-2in1-i5i507-273182898"},
		{"HP 250 G7 6BP58EA (15.6, i3, 8GB RAM, 256GB SSD, Intel HD, Win10p)", "hp-250-g7-6bp58ea-156-i3-8gb-ram-256gb-ssd-intel-hd-win10p"},
		{"Lenovo ideapad L340-15API, 81LW0047SC", "lenovo-ideapad-l340-15api-81lw0047sc"},
		{"Sony KDL-32WE615 televizor, 32\" (82 cm), LED, HD ready, HDR, HEVC (H.265)", "sony-kdl-32we615-televizor-32-82-cm-led-hd-ready-hdr-hevc-h265"},
	}

	for _, tc := range cases {
		t.Run(tc.in+" => "+tc.out, func(t *testing.T) {
			actual := URLify(tc.in)
			if actual != tc.out {
				t.Errorf("actual (%s) didn't match wanted (%s) ", actual, tc.out)
			}
		})
	}
}
