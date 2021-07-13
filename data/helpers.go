package data

import (
	"encoding/json"
	"fmt"
)

func pp(d interface{}) {
	s, _ := json.MarshalIndent(d, "", "\t")
	fmt.Print(string(s))
}
