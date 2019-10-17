import queryString from 'query-string'

export const urlToState = () => {
  const parsedUrl = queryString.parse('')

  return {
    q: parsedUrl.q || '',
    category: parsedUrl.category || '',
    sort: parsedUrl.sort || 'recent',
  }
}
