<template>
  <div class="dropdown is-hoverable">
    <div class="dropdown-trigger">
      <slot />
    </div>
    <div class="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <a
          v-for="currency in currencies"
          :key="currency"
          :class="{ 'is-active': currencyIsActive(currency) }"
          class="dropdown-item"
          @click="selectCurrency(currency)"
        >
          {{ currency }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState([
      'user',
      'currencies',
      'hasCurrencyRates'
    ])
  },
  methods: {
    currencyIsActive (currency) {
      return this.user.currency === currency
    },
    async selectCurrency (currency) {
      if (!this.hasCurrencyRates) {
        await this.getCurrencyRates()
      }
      this.setCurrency(currency)
    },
    ...mapMutations([
      'setCurrency'
    ]),
    ...mapActions([
      'getCurrencyRates'
    ])
  }
}
</script>

<style scoped>
  .currency-menu {
    min-width: 0;
  }
  .dropdown-trigger {
    cursor: default;
  }
</style>
