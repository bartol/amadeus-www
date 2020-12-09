package core

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
	TypeID     string `db:"customer_type_id"`
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
