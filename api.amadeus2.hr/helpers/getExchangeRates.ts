import fetch from 'node-fetch'

export const getExchangeRates = async () => {
  const keys = JSON.parse(process.env.FIXER_API_KEYS)
  let success = false
  let data = {}

  while (!success) {
    const key = keys[Math.floor(Math.random() * keys.length)]
    const res = await fetch(
      `http://data.fixer.io/api/latest?access_key=${key}&symbols=BAM,EUR,GBP,HRK,RSD,USD`
    ).then(res => res.json())

    if (res.success) {
      const { BAM, EUR, GBP, HRK, RSD, USD } = res.rates
      const base = Number((res.rates[res.base] / HRK).toFixed(6))

      data = {
        HRK: 1,
        EUR: Number((base * EUR).toFixed(6)),
        BAM: Number((base * BAM).toFixed(6)),
        RSD: Number((base * RSD).toFixed(6)),
        USD: Number((base * USD).toFixed(6)),
        GBP: Number((base * GBP).toFixed(6)),
      }
    }

    success = res.success
  }

  return data || new Error('Exchange Rates internal server error.')
}
