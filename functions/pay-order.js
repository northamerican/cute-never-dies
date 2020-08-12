const secretKey = process.env.STRIPE_IS_LIVE_MODE === 'true'
  ? process.env.STRIPE_SECRET_KEY_LIVE
  : process.env.STRIPE_SECRET_KEY_TEST

const stripe = require('stripe')(secretKey, {
  apiVersion: process.env.STRIPE_API_VERSION,
  maxNetworkRetries: 2
})

const headers = {
  'Access-Control-Allow-Origin': '*'
}

exports.handler = async ({ body }) => {
  const { id, token, error } = JSON.parse(body)
  // const { id, token } = JSON.parse(body)

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers
    }
  }

  try {
    const response = await stripe.orders.pay(id, {
      source: token.id
    })

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers
    }
  }
}
