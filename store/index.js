/* eslint-disable curly */
/* eslint-disable no-console */

// import { createToken } from 'vue-stripe-elements-plus'
import CreatePersistedState from 'vuex-persistedstate'

import { stateMerge } from 'vue-object-merge'
import LocaleCurrency from 'locale-currency'
import shopConfig from '~/shop.public.config.js'

const {
  siteName,
  yearCreated,
  baseCurrency,
  currencies
} = shopConfig

const buildId = process.env.BUILD_ID

const userLocalCurrency = () => {
  if (!process.browser) {
    return baseCurrency
  }
  const localCurrency = LocaleCurrency.getCurrency(navigator.language)
  const isAcceptedCurrency = currencies.includes(localCurrency)

  return isAcceptedCurrency ? localCurrency : baseCurrency
}

const defaultUser = {
  cart: [],
  name: '',
  email: '',
  buildId,
  currency: userLocalCurrency(),
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: ''
  },
  stripe: {
    orderProcessing: false,
    paymentProcessing: false,
    orderResponse: null,
    paymentResponse: null
  }
}

const netlifyFunctionsBaseUrl = '.netlify/functions'
const baseUrl = process.env.NODE_ENV === 'development'
  ? `http://localhost:8888/${netlifyFunctionsBaseUrl}`
  : `https://cuteneverdies.netlify.app/${netlifyFunctionsBaseUrl}`

const netlifyFunction = async (methodName, options = {}) => {
  const response = await fetch(`${baseUrl}/${methodName}`, options)

  return await response.json()
}

export const plugins = [
  CreatePersistedState({
    paths: ['user']
  })
]

export const state = () => ({
  siteName,
  yearCreated,
  buildId,
  baseCurrency,
  currencies: {
    [baseCurrency]: 1,
    ...currencies.reduce((currencies, currency) => ({ [currency]: null, ...currencies }), {})
  },
  skus: [],
  user: { ...defaultUser }
})

export const getters = {
  allSkus (state) {
    const noSkusLoaded = state.skus.length === 0

    if (noSkusLoaded) return []

    return state.skus
  },

  allSkusInCart (state, getters) {
    return getters.allSkus.filter(sku => sku.inCart)
  },

  skusInCartCount (state, getters) {
    return getters.allSkusInCart.reduce((skuCount, sku) => {
      return skuCount + sku.inCart
    }, 0)
  },

  hasSkusInCart (state, getters) {
    return getters.skusInCartCount > 0
  },

  hasEmptyCart (state, getters) {
    return getters.skusInCartCount === 0
  },

  orderProcessing (state) {
    return state.user.stripe.orderProcessing
  },
  orderResponse (state) {
    return state.user.stripe.orderResponse
  },
  orderError (state, getters) {
    return getters.orderResponse && (Number.isInteger(getters.orderResponse.status) && getters.orderResponse.status !== 200)
  },
  orderSuccess (state, getters) {
    return getters.orderResponse && !getters.orderError
  },
  paymentProcessing (state) {
    return state.user.stripe.paymentProcessing
  },
  paymentResponse (state) {
    return state.user.stripe.paymentResponse
  },
  paymentError (state, getters) {
    return getters.paymentResponse && (Number.isInteger(getters.paymentResponse.status) && getters.paymentResponse.status !== 200)
  },
  paymentSuccess (state, getters) {
    return getters.paymentResponse && !getters.paymentError
  },

  hasVersionChange (state) {
    return state.user.buildId !== state.buildId
  },

  currencyRate (state) {
    return state.currencies[state.user.currency]
  }
}

export const mutations = {
  updateUserData (state, data) {
    stateMerge(state.user, data)
    state.user.stripe.orderResponse = null
  },

  resetUser (state) {
    stateMerge(state.user, defaultUser)
  },

  populateSkus (state, skus) {
    state.skus = skus
  },

  populateCart (state, { products, existingSkus }) {
    // // Ensure quantities already in cart do not exceed those in stock
    // products.data.forEach(product => product.skus.data.forEach(sku => {
    //   const existingSku = existingSkus.find(existingSku => sku.id === existingSku.id) || {}
    //   const inStock = sku.inventory.quantity
    //   const inCart = existingSku.inCart || 0

    //   sku.inCart = Math.min(inCart, inStock)
    // }))

    // state.user.cart = products.data
  },

  clearCart (state) {
    // state.user.cart.forEach(product => product.skus.data.forEach(sku => {
    //   sku.inCart = 0
    // }))
  },

  openSkuModal (state, sku) {
    // if (!sku) return

    // const isMobile = window.innerWidth < 769
    // const url = `/shop/${sku.id}`

    // if (isMobile) {
    //   $nuxt._router.push(url)
    // } else {
    //   history.pushState({}, null, url)
    //   state.modals.sku = sku
    // }
  },

  dismissSkuModal (state) {
    if (state.modals.sku === null) return

    history.back()
    state.modals.sku = null
  },

  dismissModals (state) {
    Object.keys(state.modals)
      .forEach((modalName) => {
        state.modals[modalName] = null
      })
  },

  adjustItemCount (state, { sku, count }) {
    const cartItem = state.user.cart.find(skuInCart => skuInCart.id === sku.id)

    if (!cartItem) {
      state.user.cart.push({
        id: sku.id,
        inCart: count
      })
    } else {
      cartItem.inCart += count
    }
  },

  // state.user.cart: [
  //   { id: 'crunchy-green' inCart: 0 }
  // ]
  setItemCount (state, { sku, count }) {
    const cartItem = state.user.cart.find(skuInCart => skuInCart.id === sku.id)

    if (!cartItem) {
      state.user.cart.push({
        id: sku.id,
        inCart: count
      })
    } else {
      cartItem.inCart = count
    }
  },

  saveStripeOrderResponse (state, order) {
    state.user.stripe.orderResponse = order
  },

  clearStripeOrderResponse (state) {
    state.user.stripe.orderResponse = null
  },

  stripeOrderProcessing (state, isProcessing) {
    state.user.stripe.orderProcessing = isProcessing
  },

  saveStripePaymentResponse (state, payment) {
    state.user.stripe.paymentResponse = payment
  },

  clearStripePaymentResponse (state) {
    state.user.stripe.paymentResponse = null
  },

  stripePaymentProcessing (state, isProcessing) {
    state.user.stripe.paymentProcessing = isProcessing
  },

  setCurrencyRate (state, { currencyCode, rate }) {
    state.currencies[currencyCode] = rate
  },

  setCurrency (state, currencyCode) {
    state.user.currency = currencyCode
  }
}

export const actions = {
  adjustItemCount ({ commit }, { sku, count }) {
    commit('clearStripeOrderResponse')
    // dispatch('createOrder') // ! show totals on cart change? - debounce it
    commit('adjustItemCount', { sku, count })
  },

  setItemCount ({ commit }, { sku, count }) {
    commit('clearStripeOrderResponse')
    // dispatch('createOrder') // ! show totals on cart change? - debounce it
    commit('setItemCount', { sku, count })
  },

  async nuxtClientInit ({ commit, dispatch }) {
    if (getters.hasVersionChange) {
      commit('resetUser')
    }
    // if (getters.paymentError) {
    //   commit('clearStripePaymentResponse')
    // }

    // commit('stripeOrderProcessing', false)
    // commit('stripePaymentProcessing', false)
    // dispatch('setCurrency', state.user.currency)

    await dispatch('getSkus')
  },

  async getSkus ({ commit, state }) {
    const { data } = await netlifyFunction('get-skus')

    commit('populateSkus', data)
  }
}
