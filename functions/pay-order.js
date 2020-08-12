const secretKey = process.env.STRIPE_IS_LIVE_MODE === 'true'
  ? process.env.STRIPE_SECRET_KEY_LIVE
  : process.env.STRIPE_SECRET_KEY_TEST

const stripe = require('stripe')(secretKey, {
  apiVersion: process.env.STRIPE_API_VERSION
})

exports.handler = async ({ body }) => {
  const { id, token, error } = JSON.parse(body)

  if (error) {
    return {}
    // return {
    //   statusCode: 500
    // }
  }

  const response = await stripe.orders.pay(id, {
    source: token.id
  })

  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
