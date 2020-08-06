<template>
  <main>
    <section class="section">
      <div class="container">
        <sku-page :sku="sku" />
      </div>
    </section>
  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  asyncData: ({ params }) => {
    return {
      skuID: params.id
    }
  },
  validate ({ params }) {
    return params.id
  },
  computed: {
    ...mapState([
      'skus'
    ]),
    sku () {
      return this.skus.find(sku => sku.id === this.skuID)
    }
  },
  head: () => ({
    // title: this.sku.product
  })
}
</script>
