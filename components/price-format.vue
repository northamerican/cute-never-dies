<template>
  <client-only>
    <div>
      <div v-if="currencyDropdown" class="dropdown is-hoverable">
        <div class="dropdown-trigger">
          <span class="display-price">{{ displayPrice(price) }}</span>
          <span v-if="!baseCurrencyIsActive" class="display-price"> ({{ basePrice(price) }})</span>
        </div>
        <div class="dropdown-menu currency-menu" role="menu">
          <div class="dropdown-content">
            <a
              v-for="(rate, currency) in currencies"
              :key="currency"
              :class="{ 'is-active': currencyIsActive(currency) }"
              class="dropdown-item"
              @click="setCurrency(currency)"
            >
              {{ currency }}
            </a>
          </div>
        </div>
      </div>

      <span>{{ basePrice(price) }}<span v-if="showBaseCurrency"> ({{ baseCurrency }})</span></span>
    </div>
  </client-only>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  props: {
    price: {
      type: Number,
      default: () => 0
    },
    currencyDropdown: {
      type: Boolean,
      default: () => false
    },
    showBaseCurrency: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapState([
      'user',
      'baseCurrency',
      'currencies'
    ]),
    ...mapGetters([
      'currencyRate'
    ]),
    baseCurrencyIsActive () {
      return this.currencyIsActive(this.baseCurrency)
    }
  },
  methods: {
    displayPrice (price) {
      if (!process.browser) { return '' }
      return this.priceFormatter({ currency: this.user.currency }).format(+price / 100 * this.currencyRate)
    },
    basePrice (price) {
      if (!process.browser) { return '' }
      return this.priceFormatter({ currency: this.baseCurrency }).format(+price / 100)
    },
    currencyIsActive (currency) {
      return this.user.currency === currency
    },
    priceFormatter (options) {
      return new Intl.NumberFormat(navigator.language, {
        style: 'currency',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 0,
        ...options
      })
    },
    ...mapActions([
      'setCurrency'
    ])
  }
}
</script>

<style scoped>
  .display-price {
    cursor: default;
  }
  .currency-menu {
    min-width: 0;
  }
</style>
