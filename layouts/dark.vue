<template>
  <div id="app">
    <site-navbar class="is-black" />
    <nuxt />
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

  .nuxt-progress
    //? https://github.com/nuxt/nuxt.js/pull/3891
    // seems none of nuxt-progress's styles are loading
    position: fixed

  main
    flex-grow: 1
    margin-top: $navbar-height
</style>
