<template>
  <div class="sku-tile card is-shadowless">
    <div class="card-image">
      <figure class="image">
        <nuxt-link :to="localePath(`/shop/${sku.id}`)" event="" @click.native="openSkuModal(sku)">
          <img-responsive
            v-if="images[0]"
            :src="images[0]"
            :alt="sku.id"
            :min-height="309"
          />
        </nuxt-link>
        <sku-colors :sku="sku" />
      </figure>
    </div>
    <div v-if="purchaseOptions" class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">
            <nuxt-link :to="localePath(`/shop/${sku.id}`)" event="" @click.native="openSkuModal(sku)">
              {{ sku.product }}
            </nuxt-link>
          </p>
          <p class="subtitle is-6">
            <price-format
              v-if="originalPrice"
              :price="originalPrice"
              :currency-dropdown="false"
              :show-base-currency="false"
              class="original-price"
            />
            <price-format
              :class="{ 'has-text-grey-light': soldOut }"
              :price="sku.price"
              :currency-dropdown="!soldOut"
            />
          </p>
        </div>
        <sku-in-cart :sku="sku" class="media-right" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    sku: {
      type: Object,
      default: () => ({})
    },
    purchaseOptions: {
      type: Boolean,
      default: () => true
    }
  },
  data: () => ({
    images: [],
    url: ''
  }),
  computed: {
    inStock () {
      return this.sku.inventory.quantity
    },
    soldOut () {
      return this.inStock === 0
    },
    originalPrice () {
      return this.sku.attributes.original_price * 100
    }
  },
  async created () {
    const { url } = this.$config
    const skuId = this.sku.id
    const response = await fetch(`${url}/product-images/${skuId}/manifest.json`)
    const filenames = await response.json()
    const filenamesWithPaths = filenames.map(filename => `/product-images/${skuId}/${filename}`)

    this.images = filenamesWithPaths
  },
  methods: {
    ...mapMutations([
      'openSkuModal'
    ])
  }
}
</script>

<style scoped>
  .card-content {
    padding-right: 0;
    padding-left: 0;
  }

  .original-price {
    text-decoration: line-through;
    color: #dd0000;
  }
</style>
