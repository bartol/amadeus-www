package core

import (
	"testing"
)

func TestProductFunc(t *testing.T) {
	have := ProductFunc()
	want := "product func"
	if have != want {
		t.Errorf("ProductFunc() = %s; want %s", have, want)
	}
}