/* global $nuxt */

import { createToken } from 'vue-stripe-elements-plus'
import CreatePersistedState from 'vuex-persistedstate'
import { remove } from 'lodash'

import { stateMerge } from 'vue-object-merge'
import LocaleCurrency from 'locale-currency'
import {
  siteName,
  yearCreated,
  versionHash,
  baseCurrency,
  currencies
} from '~/shop.public.config.js'

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
  versionHash,
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
  : `https://cuteneverdies.com/${netlifyFunctionsBaseUrl}`

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
  versionHash,
  baseCurrency,
  currencies,
  hasCurrencyRates: false,
  currencyRates: {
    [baseCurrency]: 1
  },
  skus: [],
  user: { ...defaultUser },
  modals: {
    sku: null
  }
})

export const getters = {
  skusInCartCount (state, getters) {
    return state.user.cart.reduce((skuCount, sku) => {
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
    return getters.orderResponse && (Number.isInteger(getters.orderResponse.statusCode) && getters.orderResponse.statusCode !== 200)
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
    return getters.paymentResponse && (Number.isInteger(getters.paymentResponse.statusCode) && getters.paymentResponse.statusCode !== 200)
  },
  paymentSuccess (state, getters) {
    return getters.paymentResponse && !getters.paymentError
  },

  hasVersionChange (state) {
    return state.user.versionHash !== state.versionHash
  },

  currencyRate (state) {
    return state.currencyRates[state.user.currency]
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
    state.user.cart = []
  },

  openSkuModal (state, sku) {
    if (!sku) {
      return
    }

    const isMobile = window.innerWidth < 769
    const url = `/shop?sku=${sku.id}`
    // const url = this.$i18n.vm.localePath(`/shop?sku=${sku.id}`)

    if (isMobile) {
      $nuxt._router.push(url)
    } else {
      history.pushState({}, null, url)
      state.modals.sku = sku
    }
  },

  dismissSkuModal (state) {
    if (state.modals.sku === null) {
      return
    }

    history.back()
    state.modals.sku = null
  },

  dismissModals (state) {
    Object.keys(state.modals)
      .forEach((modalName) => {
        state.modals[modalName] = null
      })
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
      if (count === 0) {
        remove(state.user.cart, cartItem)
      }
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

  setCurrencyRates (state, rates) {
    state.currencyRates = rates
    state.hasCurrencyRates = true
  },

  setCurrency (state, currencyCode) {
    state.user.currency = currencyCode
  }
}

export const actions = {
  setItemCount ({ commit }, { sku, count }) {
    commit('clearStripeOrderResponse')
    // dispatch('createOrder') // ! show totals on cart change? - debounce it
    commit('setItemCount', { sku, count })
  },

  async nuxtClientInit ({ state, commit, dispatch, getters }) {
    if (getters.hasVersionChange) {
      commit('resetUser')
    }
    if (getters.paymentError) {
      commit('clearStripePaymentResponse')
    }

    commit('stripeOrderProcessing', false)
    commit('stripePaymentProcessing', false)

    if (state.user.currency !== baseCurrency) {
      await dispatch('getCurrencyRates')
    }

    await dispatch('getSkus')
  },

  async getSkus ({ commit, state }) {
    const { data } = await netlifyFunction('get-skus')

    commit('populateSkus', data)
  },

  async getCurrencyRates ({ commit }) {
    const response = await netlifyFunction('get-currency-rate')

    commit('setCurrencyRates', response)
  },

  async getImages (_, { sku, url }) {
    const { id } = sku
    const response = await fetch(`${url}/product-images/${id}/manifest.json`)
    const filenames = await response.json()

    return filenames
      .map(filename => `/product-images/${id}/${filename}`)
  },

  async createOrder ({ state, getters, commit }) {
    commit('stripeOrderProcessing', true)

    const { name, address, email } = state.user
    const orderData = {
      currency: state.baseCurrency,
      items: state.user.cart.map(({ id, object, inCart }) => ({
        parent: id,
        type: object,
        quantity: inCart
      })),
      shipping: {
        name, address
      },
      email
    }

    try {
      const response = await netlifyFunction('create-order', {
        body: JSON.stringify(orderData),
        method: 'POST'
      })
      commit('saveStripeOrderResponse', response)
    } catch (error) {
      if (error.response) {
        commit('saveStripeOrderResponse', error.response)
        throw new Error(error.response)
      }
      throw error
    } finally {
      commit('stripeOrderProcessing', false)
    }
  },

  async payOrder ({ commit, state, getters }) {
    commit('stripePaymentProcessing', true)

    try {
      const id = state.user.stripe.orderResponse.id
      const { token, error } = await createToken()

      if (error) {
        throw new Error({})
      }

      const response = await netlifyFunction('pay-order', {
        body: JSON.stringify({ id, token, error }),
        method: 'POST'
      })
      commit('saveStripePaymentResponse', response)

      if (!getters.paymentError) {
        $nuxt._router.push('/orders', () => {
          commit('clearCart')
        })
      }
    } catch (error) {
      if (error.response) {
        commit('saveStripePaymentResponse', error.response)
      }
    } finally {
      commit('stripePaymentProcessing', false)
    }
  },

  // Retrieve the latest order (so shipping info is updated)
  async retrieveOrder ({ commit, state, getters }) {
    try {
      if (!getters.paymentSuccess) {
        return
      }

      const id = state.user.stripe.paymentResponse.id
      const response = await netlifyFunction('retrieve-order', {
        body: JSON.stringify({ id }),
        method: 'POST'
      })

      commit('saveStripePaymentResponse', response)
    } catch (error) {
      if (error.response) {
        throw new Error(error.response)
      }
      throw error
    }
  }
}
