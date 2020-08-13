// Configured in https://dashboard.stripe.com/settings/orders
// ! Deprecated - https://stripe.com/docs/orders/dynamic-shipping-taxes

const baseCurrency = 'CAD'
const freeShippingCountries = ['CA', 'US']
// const freeShippingCountries = process.env.FREE_SHIPPING_COUNTRIES.split(',')

exports.handler = ({ body }) => {
  // const jsonBody = JSON.parse(body)
  // const { country } = jsonBody.order.shipping.address
  // const isFreeShipping = freeShippingCountries.includes(country)

  // const tax = {
  //   parent: null,
  //   type: 'tax',
  //   description: 'Taxes (included)',
  //   amount: 0,
  //   currency: baseCurrency.toLowerCase()
  // }
  // const shippingMethod = isFreeShipping ? {
  //   id: 'free_shipping',
  //   description: 'Free shipping',
  //   amount: 0,
  //   currency: baseCurrency.toLowerCase(),
  //   tax_items: []
  // } : {
  //   id: 'intl_shipping',
  //   description: 'International shipping',
  //   amount: 3800,
  //   currency: baseCurrency.toLowerCase(),
  //   tax_items: []
  // }

  // const response = {
  //   order_update: {
  //     items: [
  //       tax
  //     ],
  //     shipping_methods: [
  //       shippingMethod
  //     ]
  //   }
  // }

  return {
    statusCode: 200,
    body: '{"a": 1}'
  }
}
