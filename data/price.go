package data

func (db *DB) PriceList(product_id int) ([]Price, error) {
	var prices []Price
	rows, err := db.Query(`
	SELECT
		type, amount, min_quantity
	FROM
		product_prices
	WHERE
		product_id = ?
	;`, product_id)
	if err != nil {
		return []Price{}, err
	}
	defer rows.Close()
	for rows.Next() {
		var (
			type_        int
			amount       int
			min_quantity int
		)
		err := rows.Scan(&type_, &amount, &min_quantity)
		if err != nil {
			return []Price{}, err
		}
		p := Price{
			Type:        type_,
			Amount:      amount,
			MinQuantity: min_quantity,
		}
		prices = append(prices, p)
	}
	if err = rows.Err(); err != nil {
		return []Price{}, err
	}
	return prices, nil
}
