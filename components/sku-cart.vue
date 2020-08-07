<template>
  <div class="sku-cart columns is-mobile is-multiline">
    <div class="column is-narrow">
      <figure class="image">
        <nuxt-link :to="localePath(`/shop/${renderedSku.id}`)" event="" @click.native="openSkuModal(renderedSku)">
          <sku-gallery :sku="renderedSku" :limit="1" />
        </nuxt-link>
        <sku-colors :sku="renderedSku" />
      </figure>
    </div>
    <div class="column" style="white-space: nowrap;">
      <div class="content">
        <p class="title is-4">
          <nuxt-link :to="localePath(`/shop/${renderedSku.id}`)" event="" @click.native="openSkuModal(renderedSku)">
            <span>{{ renderedSku.product }}</span>
          </nuxt-link>
        </p>
        <p class="subtitle is-6">
          <price-format :price="renderedSku.price" :show-base-currency="true" />
        </p>
      </div>
    </div>
    <div class="column is-flex-mobile">
      <span v-if="skuOrder" class="tag is-pulled-right">{{ skuOrder.quantity }}</span>
      <sku-in-cart v-else :sku="renderedSku" class="is-pulled-right" />
    </div>
    <div class="column is-narrow-tablet has-text-right">
      <price-format v-if="skuOrder" :price="skuOrder.amount" :show-base-currency="true" />
      <price-format v-else :price="totalPrice" :show-base-currency="true" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    cartItem: {
      type: Object,
      default: () => ({})
    },
    skuOrder: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    ...mapState([
      'skus'
    ]),
    totalPrice () {
      return this.getSkuById(this.cartItem.id).price * this.cartItem.inCart
    },
    renderedSku () {
      return this.getSkuById(this.cartItem.id ? this.cartItem.id : this.getSkuById(this.skuOrder.parent))
    }
  },
  methods: {
    ...mapMutations([
      'openSkuModal'
    ]),
    getSkuById (id) {
      return this.skus.find(sku => sku.id === id)
    }
  }
}
</script>

<style scoped>
  .sku-cart {
    background: white;
  }

  .image {
    width: 177px;
  }

  .in-cart {
    text-align-last: center;
    width: 50px;
  }

  .sold-out {
    opacity: 1;
    cursor: default;
  }

  .sku-colors {
    max-height: 5px;
  }
</style>
