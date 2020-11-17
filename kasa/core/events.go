package core

import (
	"encoding/json"
	"time"
)

// Event is struct that contains event info
type Event struct {
	EventID     int       `db:"event_id" json:"event_id"`
	Type        string    `db:"type" json:"type"`
	Name        string    `db:"name" json:"name"`
	Description string    `db:"description" json:"description"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
}

// EventGet returns json encoded Event
func EventGet(eventID int) string {
	event := Event{}
	err := Global.DB.Get(&event,
		`SELECT *
		FROM events
		WHERE event_id = $1`, eventID)
	if err != nil {
		return ResponseFailurer(404, "EventGet: Event nije pronađen", err)
	}

	return ResponseSuccessr(event, "EventGet")
}

// EventGetList returns json encoded list of Event based on offset and limit
func EventGetList(offset, limit int) string {
	events := []Event{}
	err := Global.DB.Select(&events,
		`SELECT *
		FROM events
		ORDER BY created_at DESC
		OFFSET $1 LIMIT $2;`, offset, limit)
	if err != nil {
		return ResponseFailurer(500, "EventGetList: internal server error", err)
	}

	return ResponseSuccessr(events, "EventGetList")
}

// EventCreate accepts json encoded Event, creates event in db and returns json encoded created Event
func EventCreate(data string) string {
	event := Event{}
	err := json.Unmarshal([]byte(data), &event)
	if err != nil {
		return ResponseFailurer(500, "EventCreate: Pogreška pri deserializaciji zahtjeva", err)
	}

	if event.Type == "" {
		return ResponseFailurer(400, "EventCreate: Event mora imati tip", nil)
	}
	if event.Name == "" {
		return ResponseFailurer(400, "EventCreate: Event mora imati ime", nil)
	}

	tx := Global.DB.MustBegin()

	err = tx.QueryRow(
		`INSERT INTO events (type,name,description,created_at) 
		VALUES ($1,$2,$3,now()::TIMESTAMP)
		RETURNING event_id`,
		event.Type, event.Name, event.Description).Scan(&event.EventID)
	if err != nil {
		return ResponseFailurer(500, "EventCreate: Pogreška pri dodavanju eventa u bazu podataka", err)
	}

	tx.Commit()

	return EventGet(event.EventID)
}

// EventCreatep accepts Event fields as arguments, creates event in db and returns json encoded created Event
func EventCreatep(_type, name, description string) string {
	event := Event{0, _type, name, description, time.Now()}
	data, err := json.Marshal(event)
	if err != nil {
		return ResponseFailurer(500, "EventCreatep: Pogreška pri serializaciji podataka", err)
	}

	return EventCreate(string(data))
}
