package data

func (db *DB) FeatureList(product_id int) ([]Feature, error) {
	var features []Feature
	rows, err := db.Query(`
	SELECT
		key, value
	FROM
		product_features
	WHERE
		product_id = ?
	ORDER BY
		position ASC
	;`, product_id)
	if err != nil {
		return []Feature{}, err
	}
	defer rows.Close()
	for rows.Next() {
		var (
			key   string
			value string
		)
		err := rows.Scan(&key, &value)
		if err != nil {
			return []Feature{}, err
		}
		features = append(features, Feature{
			Key:   key,
			Value: value,
		})
	}
	if err = rows.Err(); err != nil {
		return []Feature{}, err
	}
	return features, nil
}
