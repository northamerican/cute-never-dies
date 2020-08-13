<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link :to="localePath('index')" class="navbar-item">
          <img :alt="siteName" :title="siteName" class="navbar-logo" src="/img/cute-never-dies.svg">
        </nuxt-link>
      </div>
      <div class="navbar-start is-shadowless">
        <nuxt-link :to="localePath('gallery')" class="navbar-item">
          <span class="is-size-7-mobile">{{ $t('Gallery') }}</span>
        </nuxt-link>
        <nuxt-link :to="localePath('shop')" class="navbar-item">
          <span class="is-size-7-mobile">{{ $t('Shop') }}</span>
        </nuxt-link>
        <nuxt-link :to="localePath('cart')" class="navbar-item">
          <span class="is-size-7-mobile">{{ $t('Cart') }}</span>
          <span :class="{ skusInCartCount }" class="tag is-primary in-cart-tag is-hidden-mobile">{{ skusInCartCount || '' }}</span>
        </nuxt-link>
        <nuxt-link v-if="paymentSuccess" :to="localePath('orders')" class="navbar-item">
          <span class="is-size-7-mobile">{{ $t('Orders') }}</span>
        </nuxt-link>
      </div>
      <div class="navbar-end">
        <currency-menu class="navbar-item is-hidden-mobile">
          <span class="display-price">{{ user.currency }}</span>
        </currency-menu>
        <nuxt-link :to="localePath('contact')" class="navbar-item">
          <span class="is-size-7-mobile">{{ $t('Contact') }}</span>
        </nuxt-link>
        <!-- <nuxt-link
          class="navbar-item"
          v-for="(locale, index) in otherLocales"
          :key="index"
          :exact="true"
          :to="switchLocalePath(locale.code)">
          {{ locale.code.toUpperCase() }}
        </nuxt-link> -->
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    darkTheme: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapState([
      'user',
      'siteName'
    ]),
    ...mapGetters([
      'skusInCartCount',
      'paymentSuccess'
    ]),
    otherLocales () {
      return this.$i18n.locales.filter(locale => locale.code !== this.$i18n.locale)
    }
  }
}
</script>

<style scoped lang="sass">
  .navbar
    position: static
    top: 0
    width: 100vw
    +tablet
      position: fixed

    .container
      display: flex

    &.is-black .navbar-item
      color: white
      &:hover
        color: $link

    .navbar-logo
      width: 42px

    &.is-black .navbar-logo
      filter: invert(1)

    .in-cart-tag
      transition-property: all
      transition-duration: 150ms
      transition-timing-function: ease-in-out

      &:empty
        opacity: 0
        transform: scale(0)
        margin-left: 0
        min-width: 0
        height: 0
        padding: 0

      &.skusInCartCount
        opacity: 1
        transform: scale(1)
        min-width: 24px
        margin-left: 0.75em

  .navbar,
  .navbar-start,
  .navbar-end
    align-items: stretch;
    display: flex;
    padding: 0;

  .navbar-menu
    flex-grow: 1;
    flex-shrink: 0;
    background: transparent;

  .navbar-start
    margin-right: auto;
    flex-grow: 1;
    justify-content: space-evenly;
    +tablet
      justify-content: flex-start;

  .navbar-end
    justify-content: flex-end;
    margin-left: auto;

  .navbar-item
    display: flex;
    align-items: center;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    height: 70px;
    +tablet
      flex-direction: row;
      height: auto;

  .is-hidden
    display: none;
</style>
