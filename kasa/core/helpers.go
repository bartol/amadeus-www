package core

import (
	"strings"

	"github.com/metal3d/go-slugify"
)

// URLify transforms string to be URL friendly
func URLify(str string) string {
	strl := strings.ToLower(str)
	return slugify.Marshal(strl)
}
