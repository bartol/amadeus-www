package core

import (
	"errors"

	"github.com/mitchellh/mapstructure"
)

// Customer is struct that contains customer info
type Customer struct {
	CustomerID int    `db:"customer_id"`
	Name       string `db:"name"`
	Address    string `db:"address"`
	PostalCode string `db:"postal_code"`
	City       string `db:"city"`
	Country    string `db:"country"`
	Phone      string `db:"phone"`
	OIB        string `db:"oib"`
	CreatedAt  string `db:"created_at"`
	UpdatedAt  string `db:"updated_at"`
	Type       string `db:"type"`
	TypeID     int    `db:"customer_type_id"`
}

// CustomerGet returns single customer
func CustomerGet(customerID int) (Customer, error) {
	customer := Customer{}

	err := Global.DB.Get(&customer,
		`SELECT customer_id, c.name, address, postal_code, city, country,
			phone, oib, created_at, updated_at, customer_type_id, t.name AS type
		FROM customers c
		INNER JOIN customer_types t USING (customer_type_id)
		WHERE customer_id = $1;`, customerID)
	if err != nil {
		Global.Log.Error(err)
		return Customer{}, err
	}

	return customer, nil
}

// CustomerList returns list of customers
func CustomerList(offset int, limit int) ([]Customer, error) {
	customers := []Customer{}

	err := Global.DB.Select(&customers,
		`SELECT customer_id, c.name, address, postal_code, city, country,
			phone, oib, created_at, updated_at, customer_type_id, t.name AS type
		FROM customers c
		INNER JOIN customer_types t USING (customer_type_id)
		ORDER BY updated_at DESC
		OFFSET $1 LIMIT $2;`, offset, limit)
	if err != nil {
		Global.Log.Error(err)
		return []Customer{}, err
	}

	return customers, nil
}

// CustomerSearch returns list of customers filtered by query
func CustomerSearch(query string, offset int, limit int) ([]Customer, error) {
	customers := []Customer{}

	err := Global.DB.Select(&customers,
		`SELECT customer_id, ts_headline(c.name, plainto_tsquery(unaccent($1))) AS name,
			address, postal_code, city, country, phone, oib, created_at, updated_at,
			customer_type_id, t.name AS type
		FROM customers c
		INNER JOIN customer_types t USING (customer_type_id)
		WHERE tsv @@ plainto_tsquery(unaccent($1))
		ORDER BY ts_rank(tsv, plainto_tsquery(unaccent($1))) DESC
		OFFSET $2 LIMIT $3;`, query, offset, limit)
	if err != nil {
		Global.Log.Error(err)
		return []Customer{}, err
	}

	return customers, nil
}

// CustomerCreate creates customer in db and returns it
func CustomerCreate(data map[string]interface{}) (Customer, error) {
	customer := Customer{}

	// decode request parameters
	err := mapstructure.Decode(data, &customer)
	if err != nil {
		Global.Log.Error(err)
		return Customer{}, err
	}

	// check if customer is valid
	if customer.Name == "" {
		err := errors.New("Kupac mora imati ime")
		Global.Log.Error(err)
		return Customer{}, err
	}
	if customer.TypeID == 0 {
		err := errors.New("Kupac mora imati tip")
		Global.Log.Error(err)
		return Customer{}, err
	}

	// start db transaction
	tx, err := Global.DB.Begin()
	if err != nil {
		Global.Log.Error(err)
		return Customer{}, err
	}

	// insert customer
	err = tx.QueryRow(
		`INSERT INTO customers (name, address, postal_code, city, country, phone,
			oib, created_at, updated_at, customer_type_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()::TIMESTAMP, NOW()::TIMESTAMP, $8)
		RETURNING customer_id;`, customer.Name, customer.Address, customer.PostalCode,
		customer.City, customer.Country, customer.Phone, customer.OIB,
		customer.TypeID).Scan(&customer.CustomerID)
	if err != nil {
		Global.Log.Error(err)
		return Customer{}, err
	}

	// commit transaction
	err = tx.Commit()
	if err != nil {
		Global.Log.Error(err)
		return Customer{}, err
	}

	// get created customer
	createdcustomer, err := CustomerGet(customer.CustomerID)
	if err != nil {
		Global.Log.Error(err)
		return Customer{}, err
	}

	return createdcustomer, nil

}
