<template>
  <div id="app">
    <site-navbar class="is-light" />
    <Nuxt />
    <site-footer />
    <sku-modal />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  mounted () {
    window.onpopstate = () => this.dismissModals()
  },
  methods: {
    ...mapMutations([
      'dismissModals'
    ])
  }
}
</script>

<style lang="sass">
  html, body
    font-family: "Rubik", $family-sans-serif
    overflow-x: hidden

  #app
    display: flex
    flex-direction: column
    // height: 100vh // https://github.com/nuxt/nuxt.js/issues/196

  .is-text-transform-none,
  .__nuxt-error-page
    text-transform: none

  main
    flex-grow: 1
    margin-top: 0
    +tablet
      margin-top: $navbar-height

  .hero-body--hero-image img
    width: 100%
</style>
