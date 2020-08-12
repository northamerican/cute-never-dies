const secretKey = process.env.STRIPE_IS_LIVE_MODE === 'true'
  ? process.env.STRIPE_SECRET_KEY_LIVE
  : process.env.STRIPE_SECRET_KEY_TEST

const stripe = require('stripe')(secretKey, {
  apiVersion: process.env.STRIPE_API_VERSION
})

const headers = {
  'Access-Control-Allow-Origin': '*'
}

exports.handler = async ({ body }) => {
  try {
    const response = await stripe.orders.create(JSON.parse(body))

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
