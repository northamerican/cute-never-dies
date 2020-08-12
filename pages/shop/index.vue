<template>
  <main>
    <section v-if="skuId" class="section">
      <div class="container">
        <sku-page :sku="getSkuById(skuId)" />
      </div>
    </section>

    <section v-else class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ $t('Shop') }} {{ skuId }}
          </h1>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="product-row container">
        <!-- <h1 class="title">
          {{ product.name }}
        </h1>
        <h2 class="subtitle">
          {{ product.caption }}
        </h2> -->
        <div class="columns is-multiline">
          <article v-for="sku in skus" :key="sku.id" class="column is-one-third-desktop is-half-tablet">
            <sku-tile :sku="sku" />
          </article>
        </div>
      </div>
    </section>
    <!-- <section class="section">
      <div class="container has-text-centered">
        <div class="content">
          <h1 class="title">
            More creatures coming soon...
          </h1>
          <h2>😻</h2>
        </div>
      </div>
    </section> -->
  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  asyncData ({ query }) {
    return {
      skuId: query.sku,
      loaded: true
    }
  },
  computed: {
    ...mapState([
      'skus'
    ])
  },
  methods: {
    getSkuById (id) {
      return this.skus.find(sku => sku.id === id)
    }
  },
  head: {
    title: 'shop'
  },
  watchQuery: ['sku']
}
</script>

<style scoped>

</style>
