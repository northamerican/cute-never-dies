const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY, {
  apiVersion: process.env.STRIPE_API_VERSION
})

exports.handler = async () => {
  const products = await stripe.skus.list({ active: true })

  return {
    statusCode: 200,
    body: JSON.stringify(products),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
