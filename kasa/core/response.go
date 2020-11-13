package core

import (
	"encoding/json"
	"log"
)

type Response struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func ResponseSuccess(data interface{}) string {
	resp := Response{200, "", data}
	json, err := json.MarshalIndent(resp, "", "  ")
	if err != nil {
		return ResponseFailure(500, "Pogreška pri serializaciji odgovora", err)
	}
	// event
	return string(json)
}

func ResponseFailure(status int, message string, err error) string {
	log.Println(err) // event
	resp := Response{status, message, nil}
	json, _ := json.MarshalIndent(resp, "", "  ")
	return string(json)
}
