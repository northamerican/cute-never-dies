<template>
  <main>
    <section class="hero">
      <div class="hero-body hero-body--hero-image">
        <div class="container">
          <img-responsive
            src="hero-images/home.jpg"
            width="768"
            alt="cute never dies"
            min-height="320"
            position="30% 50%"
          />
        </div>
      </div>
    </section>

    <section class="hero is-white">
      <div class="hero-body">
        <div class="container">
          <p>
            hash: {{ user.buildId }}
          </p>
          <h1 class="title">
            cute never dies
          </h1>
          <h2 class="subtitle">
            original mask designs
          </h2>
        </div>
      </div>
    </section>

    <div class="container">
      <hr>
    </div>

    <section class="hero is-white hero-featured">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Featured creatures
          </h1>
          <p class="subtitle">
            <nuxt-link :to="localePath('shop')" class="is-size-5">
              More in the shop →
            </nuxt-link>
          </p>
        </div>
      </div>
    </section>

    <section class="hero is-white home-featured">
      <div class="container">
        <div class="columns">
          <article v-for="sku in featuredSkus" :key="sku.id" class="column is-one-third-desktop is-half-tablet">
            <sku-tile :sku="sku" :purchase-options="false" />
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  // layout: 'dark',
  data: () => ({
    featuredSkusList: [
      'crunchy-green',
      'tazer-tiger',
      'tazer-candy'
    ]
  }),
  computed: {
    ...mapState([
      'user'
    ]),
    ...mapGetters([
      'allSkus'
    ]),
    featuredSkus () {
      return this.featuredSkusList.map(this.idToSku)
    }
  },
  methods: {
    idToSku (id) {
      return this.allSkus.find(sku => sku.id === id)
    }
  },
  head: {
    title: 'home'
  }
}
</script>

<style scoped lang="sass">
  .hero-featured a
    // https://github.com/jgthms/bulma/issues/1828
    color: $link !important

  .hero-body--hero-image
    padding: 0

  .hero-image-graphic
    padding: 70px
    margin-top: 10px
    margin-bottom: 90px
    height: 80vw
    max-height: 650px
    +tablet
      height: 40vw
    +desktop
      margin-top: 50px

</style>
