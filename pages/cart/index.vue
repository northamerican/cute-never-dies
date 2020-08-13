<template>
  <main>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Cart
          </h1>
        </div>
      </div>
    </section>

    <section v-if="hasSkusInCart" class="section">
      <div class="container">
        <div class="product-row">
          <transition-group name="cart-list" tag="div">
            <article v-for="cartItem in user.cart" :key="cartItem.id" class="sku-cart-container">
              <sku-cart :cart-item="cartItem" />
              <hr>
            </article>
          </transition-group>
        </div>
      </div>
      <div class="container">
        <div class="columns is-mobile">
          <div class="column has-text-right has-text-weight-bold">
            Cart total
          </div>
          <div class="column is-narrow">
            <price-format :price="totalPrice" :show-base-currency="true" />
          </div>
        </div>
      </div>
    </section>

    <section v-if="hasEmptyCart" class="section">
      <div class="container has-text-centered">
        <div class="content">
          <h1 class="title">
            You have no creatures in your cart.
          </h1>
        </div>
        <div class="container mask-illustration-random-container">
          <svg
            v-for="(colors, i) in maskRandomColors(4)"
            :key="i"
            :style="`background-color: ${colors[4]}`"
            class="mask-illustration-random"
          >
            <use
              v-bind="{ 'xlink:href': '/mask-illustration/mask-illustration--tazer.svg#mask' }"
              :style="`
                --color_muzzle: ${colors[0]};
                --color_decorations: ${colors[1]};
                --color_face: ${colors[2]};
                --color_nose: ${colors[3]};
              `"
            />
          </svg>
        </div>
      </div>
    </section>

    <section v-if="hasSkusInCart" class="section">
      <div class="container">
        <h1 class="title">
          Place order
        </h1>
        <h2 class="subtitle">
          Major credit cards accepted
        </h2>
        <div class="columns">
          <form class="column is-half-desktop is-12-tablet" method="POST" action="/cart" accept-charset="UTF-8" @submit.prevent="createOrder">
            <div class="field">
              <p class="control">
                <label class="label">Name</label>
                <input
                  v-model="name"
                  class="input"
                  required
                  type="text"
                  name="name"
                  @change="updateUserData({ name })"
                >
              </p>
            </div>

            <div class="field">
              <p class="control">
                <label class="label">E-mail</label>
                <input
                  v-model="email"
                  class="input"
                  required
                  type="email"
                  name="email"
                  @change="updateUserData({ email })"
                >
              </p>
            </div>

            <div class="field field-body">
              <div class="field">
                <p class="control">
                  <label class="label">Address</label>
                  <input
                    v-model="address.line1"
                    class="input"
                    required
                    type="text"
                    name="address"
                    @change="updateUserData({ address })"
                  >
                </p>
              </div>
              <div class="field">
                <p class="control">
                  <label class="label">Apt., unit, floor, etc</label>
                  <input
                    v-model="address.line2"
                    class="input"
                    placeholder="optional"
                    type="text"
                    name="address_line2"
                    @change="updateUserData({ address })"
                  >
                </p>
              </div>
            </div>

            <div class="field field-body">
              <div class="field">
                <p class="control">
                  <label class="label">City</label>
                  <input
                    v-model="address.city"
                    class="input"
                    required
                    type="text"
                    name="city"
                    @change="updateUserData({ address })"
                  >
                </p>
              </div>
              <div class="field">
                <p class="control">
                  <label class="label">State</label>
                  <input
                    v-model="address.state"
                    class="input"
                    required
                    type="text"
                    name="state"
                    @change="updateUserData({ address })"
                  >
                </p>
              </div>
            </div>

            <div class="field field-body">
              <div class="field country-field">
                <p class="control">
                  <label class="label">Country</label>
                  <span class="select">
                    <select v-model="address.country" name="country" @change="updateUserData({ address })">
                      <option v-for="country in countries" :key="country.name" :value="country.alpha2Code">{{ country.name }}</option>
                    </select>
                  </span>
                </p>
              </div>
              <div class="field">
                <p class="control">
                  <label class="label">Postal Code</label>
                  <input
                    v-model="address.postal_code"
                    class="input"
                    required
                    type="text"
                    name="postal_code"
                    @change="updateUserData({ address })"
                  >
                </p>
              </div>
            </div>

            <div class="field">
              <p class="control">
                <input v-if="orderProcessing" class="button is-primary" type="submit" disabled value="Processing Total...">
                <input v-else v-show="!orderResponse || orderError" class="button is-primary" type="submit" value="Calculate total">
              </p>
            </div>
          </form>
        </div>
      </div>

      <div v-if="orderSuccess" class="container">
        <div class="columns">
          <div class="column is-one-quarter">
            <div class="columns is-gapless is-multiline">
              <template v-for="taxLine in taxes">
                <div :key="taxLine.description" class="column is-8 has-text-weight-bold">
                  {{ taxLine.description }}
                </div>
                <div :key="`${taxLine.description}-amount`" class="column is-4 has-text-right">
                  <price-format :price="taxLine.amount" :show-base-currency="true" />
                </div>
              </template>

              <div class="column is-8 has-text-weight-bold">
                {{ shippingMethods[0].description }}
              </div>
              <div class="column is-4 has-text-right">
                <price-format :price="shippingMethods[0].amount" :show-base-currency="true" />
              </div>

              <div class="column is-8 has-text-weight-bold">
                Order total
              </div>
              <div class="column is-4 has-text-right has-text-weight-bold">
                <price-format :price="orderResponse.amount" :show-base-currency="true" />
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter">
            <div class="field">
              <p class="control">
                <card
                  :stripe="stripePublishableKey"
                  :class="{ hasCard }"
                  :options="stripeOptions"
                  class="stripe-card"
                  @change="hasCard = $event.complete"
                />
              </p>
            </div>

            <div class="field">
              <p class="control">
                <button v-if="paymentProcessing" class="button is-primary" disabled>
                  Processing payment...
                </button>
                <button v-else :disabled="!hasCard" class="button is-primary" @click="payOrder">
                  Pay with credit card
                </button>
              </p>
            </div>
            <div class="field" />
          </div>
        </div>
      </div>

      <div class="container">
        <div class="columns">
          <div class="column is-half">
            <div v-if="paymentError" class="message is-danger">
              <div class="message-body">
                {{ paymentResponse.raw.message }}
              </div>
            </div>
            <div v-if="orderError" class="message is-danger">
              <div class="message-body">
                {{ orderResponse.raw.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { Card } from 'vue-stripe-elements-plus'
import { sampleSize } from 'lodash'
import countries from '~/assets/js/countries'
import colorsAda from '~/assets/js/colors-ada'

export default {
  components: {
    Card
  },
  data ({ $config }) {
    return {
      stripePublishableKey: $config.STRIPE_IS_LIVE_MODE === 'true'
        ? $config.STRIPE_PUBLISHABLE_KEY_LIVE
        : $config.STRIPE_PUBLISHABLE_KEY_TEST,
      stripeOptions: {
        hidePostalCode: true
      },
      hasCard: false,
      name: '',
      email: '',
      address: {},
      countries
    }
  },
  computed: {
    ...mapState([
      'user',
      'skus',
      'siteName'
    ]),
    ...mapGetters([
      'skusInCartCount',
      'hasSkusInCart',
      'hasEmptyCart',
      'orderProcessing',
      'orderResponse',
      'orderError',
      'orderSuccess',
      'paymentResponse',
      'paymentProcessing',
      'paymentError'
    ]),
    totalPrice () {
      return this.user.cart
        .map(({ id, inCart }) => this.getSkuById(id).price * inCart)
        .reduce((a, b) => a + b)
    },
    taxes () {
      if (!this.orderResponse || this.orderError) { return [] }
      return this.orderResponse.items.filter(item => item.type === 'tax')
    },
    shippingMethods () {
      if (!this.orderResponse || this.orderError) { return {} }
      return this.orderResponse.shipping_methods
    }
  },
  beforeMount () {
    const user = this.user

    this.name = user.name
    this.email = user.email
    this.address = { ...user.address }
    this.clearStripeOrderResponse()
  },
  methods: {
    ...mapMutations([
      'updateUserData',
      'clearStripeOrderResponse'
    ]),
    ...mapActions([
      'createOrder',
      'payOrder'
    ]),
    getSkuById (id) {
      return this.skus.find(sku => sku.id === id)
    },
    maskRandomColors (n) {
      return Array.from(Array(n), () => sampleSize(colorsAda, 5))
    }
  },
  head: {
    title: 'cart'
  }
}
</script>

<style scoped lang="sass">
  .stripe-card
    border: 1px solid grey

    &.hasCard
      border-color: green

  .mask-illustration-random-container
    font-size: 0 // prevent spacing
    justify-content: center

  .mask-illustration-random
    width: 100%
    +desktop
      width: 500px
      height: 500px

  .country-field
    max-width: calc((100% - .75rem) / 2)

  .sku-cart-container
    max-height: 200px
    overflow: hidden
    will-change: max-height, opacity

  .cart-list-enter-active, .cart-list-leave-active
    transition-duration: .3s, .3s
    transition-property: max-height, opacity

  .cart-list-enter, .cart-list-leave-to
    max-height: 0
    margin: 0
    opacity: 0

</style>
