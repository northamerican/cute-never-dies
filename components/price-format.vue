<template>
  <client-only>
    <!-- <div v-if="currencyDropdown" class="dropdown is-hoverable">
      <div class="dropdown-trigger">
        {{ baseCurrencyIsActive ? displayPrice(price) : '' }} ({{ basePrice(price) }})
      </div>
      <div class="dropdown-menu currency-menu" role="menu">
        <div class="dropdown-content">
          <a
            v-for="currency in currencies"
            :key="currency"
            :class="{ 'is-active': currencyIsActive(currency) }"
            class="dropdown-item"
            @click="setCurrency(currency)"
          >
            {{ currency }}
          </a>
        </div>
      </div>
    </div> -->
    <currency-menu v-if="currencyDropdown">
      <span
        v-if="baseCurrencyIsActive"
        class="display-price"
      >
        {{ basePrice(price) }}
      </span>
      <span
        v-else
        class="display-price"
      >
        {{ displayPrice(price) }} ({{ basePrice(price) }})
      </span>
    </currency-menu>

    <span v-else>{{ basePrice(price) }}<span v-if="showBaseCurrency"> ({{ baseCurrency }})</span></span>
  </client-only>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

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
      'baseCurrency'
    ]),
    ...mapGetters([
      'currencyRate'
    ]),
    baseCurrencyIsActive () {
      return this.user.currency === this.baseCurrency
    }
  },
  methods: {
    displayPrice (price) {
      if (!process.browser) { return '' }
      return this.priceFormatter({ currency: this.user.currency, minimumFractionDigits: 2 }).format(+price / 100 * this.currencyRate)
    },
    basePrice (price) {
      if (!process.browser) { return '' }
      return this.priceFormatter({ currency: this.baseCurrency }).format(+price / 100)
    },
    priceFormatter (options) {
      return new Intl.NumberFormat(navigator.language, {
        style: 'currency',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 0,
        ...options
      })
    }
  }
}
</script>
