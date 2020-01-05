import queryString from 'query-string'

export const urlToState = location => {
  if (location && location.search) {
    const parsedUrl = queryString.parse(location.search.slice(1))

    return parsedUrl.q ? parsedUrl.q.toString() : ''
  }
  return ''
}
