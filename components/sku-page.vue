<template>
  <div class="sku-page">
    <div class="columns">
      <div class="column is-half-desktop">
        <figure class="image">
          <sku-gallery :sku="sku" :limit="1" />
        </figure>
      </div>
      <div class="column is-5-desktop">
        <div class="columns is-mobile">
          <div class="column">
            <p class="title is-3">
              {{ sku.product }}
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
          <div class="column is-narrow">
            <p class="is-pulled-right">
              <sku-in-cart :sku="sku" />
            </p>
          </div>
        </div>
        <!-- <div class="content" v-html="product.description"></div> -->
        <div class="content">
          <p>
            An original design made from machine cut, hand-shaped and assembled acrylic plastic. This wearable artwork transforms you into a wild creature engineered in a virtual world.
          </p>
          <p>
            The shape is designed to rest snuggly on the wearer's head. The adjustable natural rubber strap fits heads of all sizes and the detachable chin lets you show off your ferocious fangs or smile beneath.
          </p>

          <p>
            Each <i>{{ sku.product }}</i> is uniquely numbered as part of a series.
          </p>

          <p class="subtitle is-4 is-marginless">
            Shipping and returns
          </p>
          <p>
            Ships from Montreal, Canada.<br> Shipping to Canada and the U.S.A. included.
          </p>
          <p>
            Refunds can be issued within 14 days of delivery. <br>
            <nuxt-link :to="localePath('contact')">
              {{ $t('Contact us') }}
            </nuxt-link> with any questions.<br>
          </p>
        </div>
      </div>
    </div>
    <sku-gallery :sku="sku" :limit="[1, Infinity]" />
    <hr>
    <div class="columns">
      <mask-illustration :sku="sku" />
    </div>
    <sku-colors :sku="sku" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    sku: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState([
      'user',
      'siteName'
    ]),
    totalPrice () {
      return this.sku.price * this.sku.inCart
    },
    product () {
      const productName = this.sku.product

      return this.user.cart.find(product => product.name === productName)
    },
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
    ])
  }
}
</script>

<style scoped>
  .original-price {
    text-decoration: line-through;
    color: #dd0000;
  }
</style>
