<template>
  <div class="sku-cart columns is-mobile is-multiline">
    <div class="column is-narrow">
      <figure class="image">
        <a :href="`/shop/${renderedSku.id}`" @click.prevent="openSkuModal(renderedSku)">
          <sku-gallery :sku="renderedSku" :limit="1" />
        </a>
        <sku-colors :sku="renderedSku" />
      </figure>
    </div>
    <div class="column" style="white-space: nowrap;">
      <div class="content">
        <p class="title is-4">
          <a :href="`/shop/${renderedSku.id}`" @click.prevent="openSkuModal(renderedSku)">
            <span>{{ renderedSku.product }}</span>
          </a>
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
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    sku: {
      type: Object,
      default: () => ({})
    },
    skuOrder: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    ...mapGetters([
      'allSkus'
    ]),
    totalPrice () {
      return this.sku.price * this.sku.inCart
    },
    renderedSku () {
      return this.sku.id ? this.sku : this.getSkuById(this.skuOrder.parent)
    }
  },
  methods: {
    ...mapMutations([
      'openSkuModal'
    ]),
    getSkuById (id) {
      return this.allSkus.find(sku => sku.id === id)
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
