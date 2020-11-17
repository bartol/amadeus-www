package core

import (
	"github.com/metal3d/go-slugify"
)

// URLify transforms string to be URL friendly
func URLify(str string) string {
	return slugify.Marshal(str, true)
}
