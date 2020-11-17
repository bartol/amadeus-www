package core

import (
	"encoding/json"
)

// Response is struct returned from every exported function
type Response struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// ResponseSuccess returns json encoded Response with success status code and logs an event
func ResponseSuccess(data interface{}) string {
	resp := Response{200, "", data}
	json, err := json.MarshalIndent(resp, "", "  ")
	if err != nil {
		return ResponseFailure(500, "Pogreška pri serializaciji odgovora", err)
	}
	// event
	return string(json)
}

// ResponseFailure returns json encoded Response with failure status code and logs an event
func ResponseFailure(status int, message string, err error) string {
	// event
	resp := Response{status, message, nil}
	json, _ := json.MarshalIndent(resp, "", "  ")
	return string(json)
}
