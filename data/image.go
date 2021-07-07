package data

func (db *DB) ImageList(product_id int) ([]string, error) {
	var image_urls []string
	rows, err := db.Query(`
	SELECT
		image_url
	FROM
		product_images
	WHERE
		product_id = ?
	ORDER BY
		position ASC
	;`, product_id)
	if err != nil {
		return []string{}, err
	}
	defer rows.Close()
	for rows.Next() {
		var url string
		err := rows.Scan(&url)
		if err != nil {
			return []string{}, err
		}
		image_urls = append(image_urls, url)
	}
	if err = rows.Err(); err != nil {
		return []string{}, err
	}
	return image_urls, nil
}
