<template>
  <main>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ $t('Shop') }}
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
  computed: {
    ...mapState([
      'skus'
    ])
  },
  head: {
    title: 'shop'
  }
}
</script>

<style scoped>

</style>
