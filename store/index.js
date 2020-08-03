/* eslint-disable curly */
/* eslint-disable no-console */
// /* global $route */

// import axios from 'axios'
// import { createToken } from 'vue-stripe-elements-plus'
// import { stateMerge } from 'vue-object-merge'
// import CreatePersistedState from 'vuex-persistedstate'
import LocaleCurrency from 'locale-currency'
import shopConfig from '~/shop.public.config.js'

const {
  siteName,
  yearCreated,
  baseCurrency,
  currencies,
  versionHash
} = shopConfig

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
  // versionHash,
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

// const baseUrl = process.env.NETLIFY_DEV ? 'http://localhost:8888' : process.env.URL
console.log('process.env.NETLIFY_DEV', process.env.NETLIFY_DEV)
const baseUrl = process.env.NETLIFY_DEV ? 'http://localhost:8888' : 'https://cuteneverdies.netlify.app'
// const netlifyFunctionsBaseUrl = process.env.NETLIFY_FUNCTIONS_BASE_URL

const netlifyFunction = async (methodName, options) => {
  const headers = options && options.headers ? {
    'Content-Type': 'application/json',
    ...options.headers
  } : {
    'Content-Type': 'application/json'
  }
  const response = await fetch(`${baseUrl}/.netlify/functions/${methodName}`, {
    headers,
    ...options
  })

  return await response.json()
}

export const plugins = [
]

export const state = () => ({
  siteName,
  yearCreated,
  versionHash,
  baseCurrency,
  currencies: {
    [baseCurrency]: 1,
    ...currencies.reduce((currencies, currency) => ({ [currency]: null, ...currencies }), {})
  },
  skus: {},
  user: { ...defaultUser }
})

export const getters = {
  allSkus (state) {
    const noSkusLoaded = state.user.cart.length === 0

    if (noSkusLoaded) return []

    return state.user.cart.reduce((skus, product) => {
      return skus.concat(product.skus.data)
    }, [])
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

  hasVersionUpdate (state) {
    return state.user.versionHash !== state.versionHash
  },

  currencyRate (state) {
    return state.currencies[state.user.currency]
  }
}

export const mutations = {
  populateSkus (state, skus) {
    state.skus = skus
  }
}

export const actions = {
  async nuxtServerInit ({ dispatch }) {
    await dispatch('getSkus')
  },

  async getSkus ({ commit, state }) {
    const { data } = await netlifyFunction('get-skus')

    commit('populateSkus', data)
  },

  async getImages ({ commit, state }, skuId) {
    const imageUrls = await netlifyFunction('get-images', {
      body: JSON.stringify({ skuId }),
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })

    console.log(imageUrls)

    return imageUrls
  }
}
