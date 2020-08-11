<template>
  <div class="sku-tile card is-shadowless">
    <div class="card-image">
      <figure class="image">
        <nuxt-link :to="localePath(`/shop?sku=${sku.id}`)" event="" @click.native="openSkuModal(sku)">
          <img-responsive
            v-if="images[0]"
            :srcset="[720, 476]"
            :src="images[0]"
            :sizes="{
              desktop: '33vw',
              tablet: '50vw'
            }"
            :alt="sku.id"
          />
        </nuxt-link>
        <sku-colors :sku="sku" />
      </figure>
    </div>
    <div v-if="purchaseOptions" class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">
            <nuxt-link :to="localePath(`/shop?sku=${sku.id}`)" event="" @click.native="openSkuModal(sku)">
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
import { mapMutations, mapActions } from 'vuex'

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
  async fetch () {
    this.images = await this.getImages({
      sku: this.sku,
      url: this.$config.url
    })
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
  methods: {
    ...mapMutations([
      'openSkuModal'
    ]),
    ...mapActions([
      'getImages'
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
