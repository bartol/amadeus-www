package core

import (
	"encoding/json"
	"fmt"
)

// Response is struct returned from every exported function
type Response struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// ResponseSuccess returns json encoded Response with success status code and logs an event
func ResponseSuccess(data interface{}, message string) string {
	resp := Response{200, message, data}
	json, err := json.MarshalIndent(resp, "", "  ")
	if err != nil {
		return ResponseFailure(500, "ResponseSuccess: Pogreška pri serializaciji odgovora", err)
	}
	EventCreatep("INFO", fmt.Sprintf("[200] %s", message), "")
	return string(json)
}

// ResponseSuccessr returns json encoded Response with success status code (prevents recursion)
func ResponseSuccessr(data interface{}, message string) string {
	resp := Response{200, message, data}
	json, err := json.MarshalIndent(resp, "", "  ")
	if err != nil {
		return ResponseFailure(500, "ResponseSuccess: Pogreška pri serializaciji odgovora", err)
	}
	return string(json)
}

// ResponseFailure returns json encoded Response with failure status code and logs an event
func ResponseFailure(status int, message string, err error) string {
	EventCreatep("INFO",
		fmt.Sprintf("[%d] %s", status, message),
		fmt.Sprintf("err: %s", err))
	resp := Response{status, message, nil}
	json, _ := json.MarshalIndent(resp, "", "  ")
	return string(json)
}

// ResponseFailurer returns json encoded Response with failure status code (prevents recursion)
func ResponseFailurer(status int, message string, err error) string {
	resp := Response{status, message, nil}
	json, _ := json.MarshalIndent(resp, "", "  ")
	return string(json)
}
