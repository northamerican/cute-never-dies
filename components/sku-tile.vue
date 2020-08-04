<template>
  <div class="sku-tile card is-shadowless">
    <div class="card-image">
      <figure class="image">
        <!-- <a :href="`/shop/${sku.id}`" @click.prevent="openSkuModal(sku)"> -->
        <a :href="`/shop/${sku.id}`">
          <img-responsive
            v-if="images[0]"
            :src="images[0]"
            :alt="sku.id"
          />
        </a>
        <sku-colors :sku="sku" />
      </figure>
    </div>
    <div v-if="purchaseOptions" class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">
            <a :href="`/shop/${sku.id}`" @click.prevent="openSkuModal(sku)">
              {{ sku.product }}
            </a>
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
/* eslint-disable no-console */
// import { mapActions } from 'vuex'

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
    images: []
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
    const skuId = this.sku.id
    const response = await fetch(`/product-images/${skuId}/manifest.json`)
    const filenames = await response.json()

    this.images = filenames.map(filename => `product-images/${skuId}/${filename}`)
  },
  methods: {
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
