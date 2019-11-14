import queryString from 'query-string'

export const urlToState = location => {
  const parsedUrl = queryString.parse(location.search.slice(1))

  return parsedUrl.q ? parsedUrl.q : ''
}
