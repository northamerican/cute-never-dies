const fetch = require('node-fetch')

const exchangeBaseUrl = 'https://api.exchangerate-api.com/v4/latest/'
const baseCurrency = 'CAD'

const headers = {
  'Access-Control-Allow-Origin': '*'
}

exports.handler = async () => {
  const response = await fetch(`${exchangeBaseUrl}${baseCurrency}`, {
    headers: {
      Accept: 'application/json'
    }
  })

  const { rates } = await response.json()

  return {
    statusCode: 200,
    body: JSON.stringify(rates),
    headers
  }
}
