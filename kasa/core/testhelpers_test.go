package core

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"reflect"
	"strings"
	"testing"

	"github.com/kr/pretty"
)

func SubtestName(tc interface{}) string {
	var args []string
	tcval := reflect.ValueOf(tc)
	for i := 0; i < tcval.NumField(); i++ {
		args = append(args, fmt.Sprint(tcval.Field(i)))
	}
	return strings.Join(args, "_")
}

func GoldenCheck(t *testing.T, dir string, tc interface{}, returned ...interface{}) {
	subtestName := SubtestName(tc)

	// create golden files dir if it doesn't exist
	dirPath := "./testdata/" + dir
	os.MkdirAll(dirPath, 0700)

	goldenPath := fmt.Sprintf("%s/%s.out.golden", dirPath, subtestName)

	t.Run(subtestName, func(t *testing.T) {
		// create virtual file from returned output
		var vFile []string
		for _, v := range returned {
			vFile = append(vFile, pretty.Sprint(v))
		}
		actual := []byte(strings.Join(vFile, "\n"))

		// update golden file with current output if flag is set
		if *Update {
			err := ioutil.WriteFile(goldenPath, actual, 0644)
			if err != nil {
				t.Fatal(err)
			}
		}

		// create empty golden file if it doesn't exist
		_, err := os.Stat(goldenPath)
		if os.IsNotExist(err) {
			ioutil.WriteFile(goldenPath, []byte{}, 0644)
		}

		// read golden file
		golden, err := ioutil.ReadFile(goldenPath)
		if err != nil {
			t.Fatal(err)
		}

		// compare
		if !bytes.Equal(actual, golden) {
			// write actual to file and run diff on it
			file, err := ioutil.TempFile("/tmp/amadeus-kasa", "testfile")
			if err != nil {
				t.Fatal(err)
			}
			defer os.Remove(file.Name())
			err = ioutil.WriteFile(file.Name(), actual, 0644)
			if err != nil {
				t.Fatal(err)
			}
			cmd, _ := exec.Command("diff", "-u", "--color=always", goldenPath, file.Name()).Output()

			t.Errorf("actual didn't match golden (%s)\n%s", goldenPath, cmd)
		}
	})
}

func GoldenGet(t *testing.T, dir string, tc interface{}) map[string]interface{} {
	subtestName := SubtestName(tc)
	goldenPath := fmt.Sprintf("./testdata/%s/in/%s.in.golden", dir, subtestName)

	// read golden file
	golden, err := ioutil.ReadFile(goldenPath)
	if err != nil {
		t.Fatal(err)
	}

	// decode golden file
	var data map[string]interface{}
	err = json.Unmarshal(golden, &data)
	if err != nil {
		t.Fatal(err)
	}

	return data
}

func RemoveDateFields(product *Product) {
	product.CreatedAt = ""
	product.UpdatedAt = ""
	for i := range product.Recommendations {
		product.Recommendations[i].CreatedAt = ""
		product.Recommendations[i].UpdatedAt = ""
	}
}
