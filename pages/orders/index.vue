<template>
  <main v-if="paymentResponse">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Orders
          </h1>
          <h2 class="subtitle">
            {{ orderHeader }} <span class="order-header-emoji">{{ orderEmoji }}</span>
          </h2>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-6">
            <div class="content">
              <p>
                <b>{{ shippingInfo.name }}</b><br>
                <span>{{ shippingInfo.address.line1 }}<br></span>
                <span v-if="shippingInfo.address.line2">{{ shippingInfo.address.line2 }}<br></span>
                <span>{{ shippingInfo.address.city }}, {{ shippingInfo.address.state }}<br></span>
                <span>{{ countryName }}<br></span>
                <span>{{ shippingInfo.address.postal_code }}</span>
              </p>
            </div>
          </div>
          <div class="column is-6">
            <div class="columns is-gapless is-multiline">
              <div class="column is-3 has-text-weight-bold">
                Date Ordered
              </div>
              <div class="column is-9">
                {{ $d(paymentResponse.created * 1000) }}
              </div>

              <div class="column is-3 has-text-weight-bold">
                Order ID
              </div>
              <div class="column is-9">
                {{ paymentResponse.id }}
              </div>

              <div class="column is-3 has-text-weight-bold">
                Status
              </div>
              <div class="column is-9">
                <span>{{ orderStatus }} </span>
                <span v-if="shippingCarrier"> - {{ shippingCarrier }}</span><wbr>
                <a v-if="trackingLink" :href="trackingLink" target="_blank"> {{ trackingNumber }}</a>
                <span v-if="trackingNumber && !trackingLink"> {{ trackingNumber }}</span>
              </div>
            </div>
          </div>
        </div>

        <hr>
        <div class="product-row">
          <article v-for="sku in purchasedSkus" :key="sku.id">
            <sku-cart :sku-order="sku" />
            <hr>
          </article>
        </div>

        <div class="columns is-mobile">
          <template v-for="taxLine in stripeTaxes">
            <div :key="taxLine.description" class="column has-text-right has-text-weight-bold">
              {{ taxLine.description }}
            </div>
            <div :key="`${taxLine.description}-amount`" class="column is-narrow">
              <price-format :price="taxLine.amount" />
            </div>
          </template>
        </div>

        <div class="columns is-mobile">
          <div class="column has-text-right has-text-weight-bold">
            {{ stripeShipping.description }}
          </div>
          <div class="column is-narrow">
            <price-format :price="stripeShipping.amount" />
          </div>
        </div>

        <div class="columns is-mobile">
          <div class="column has-text-right has-text-weight-bold">
            Order total
          </div>
          <div class="column is-narrow">
            <price-format :price="paymentResponse.amount" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import countries from '~/assets/js/countries'

export default {
  data: () => ({
    countries
  }),
  computed: {
    ...mapGetters([
      'allSkus',
      'paymentResponse',
      'paymentSuccess'
    ]),
    totalPrice () {
      return this.paymentResponse.amount
    },
    shippingInfo () {
      return this.paymentResponse.shipping
    },
    shippingCarrier () {
      return this.shippingInfo.carrier
    },
    trackingNumber () {
      return this.shippingInfo.tracking_number
    },
    trackingLink () {
      const carriers = {
        'Canada Post': number => `https://www.canadapost.ca/trackweb/en#/details/${number}`
      }
      const hasLink = Object.keys(carriers).includes(this.shippingCarrier)

      if (!hasLink) { return null }
      if (!this.trackingNumber) { return null }

      return carriers[this.shippingCarrier](this.trackingNumber)
    },
    paymentStatus () {
      return this.paymentResponse.status
    },
    stripeTaxes () {
      return this.paymentResponse.items.filter(item => item.type === 'tax')
    },
    stripeShipping () {
      const selectedShippingMethod = this.paymentResponse.selected_shipping_method

      return this.paymentResponse.shipping_methods.find(shippingMethod => shippingMethod.id === selectedShippingMethod)
    },
    purchasedSkus () {
      return this.paymentResponse.items.filter(item => item.type === 'sku')
    },
    countryName () {
      const shippingCountryCode = this.shippingInfo.address.country
      const countryData = this.countries.find((country) => {
        return shippingCountryCode === country.alpha2Code
      })

      return (countryData && countryData.name) || this.shippingInfo.address.country
    },
    orderHeader () {
      return this.$t({
        paid: 'Thank you! Your order is being processed.',
        fulfilled: 'Your order has been shipped.',
        canceled: 'Your order was cancelled.',
        returned: 'Your order was returned.'
      }[this.paymentStatus])
    },
    orderEmoji () {
      return ({
        paid: '😺',
        fulfilled: '😸',
        canceled: '😿',
        returned: '🙀'
      }[this.paymentStatus])
    },
    orderStatus () {
      return this.$t({
        paid: 'Paid',
        fulfilled: 'Shipped',
        canceled: 'Canceled',
        returned: 'Returned'
      }[this.paymentStatus])
    }
  },
  beforeMount () {
    if (this.paymentSuccess) {
      this.retrieveOrder()
    }
  },
  methods: {
    ...mapActions([
      'retrieveOrder'
    ])
  },
  head: {
    title: 'orders'
  }
}
</script>

<style scoped>
  .order-header-emoji {
    text-shadow: 1px 0 white, 0 1px white, -1px 0 white, 0 -1px white;
  }
</style>
