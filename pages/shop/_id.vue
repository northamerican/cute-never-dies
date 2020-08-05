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
import { mapGetters } from 'vuex'

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
    ...mapGetters([
      'allSkus'
    ]),
    sku () {
      return this.allSkus.find(sku => sku.id === this.skuID)
    }
  },
  head: () => ({
    // title: this.sku.product
  })
}
</script>
