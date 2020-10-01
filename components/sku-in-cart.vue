<template>
  <div>
    <div v-if="inStock">
      <a v-if="noneInCart" class="button is-light" @click="setInCart(inCart + 1)">Add to cart</a>
      <div v-if="inCart" class="field has-addons">
        <p class="control">
          <a class="button is-light" @click="setInCart(inCart - 1)">
            -
          </a>
        </p>
        <p class="control">
          <select :value="inCart" class="in-cart button is-light" @change="setInCart(+$event.target.value)">
            <option v-for="n in stockAvailableRange" :key="n">
              {{ n }}
            </option>
          </select>
        </p>
        <p class="control">
          <a :disabled="hasAllInCart" class="button is-light" @click="setInCart(inCart + 1)">
            +
          </a>
        </p>
      </div>
    </div>
    <div v-else>
      <a class="button is-light is-static">Sold out</a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  props: {
    sku: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    inStock () {
      return this.sku.inventory.quantity
    },
    inCart () {
      const cartItem = this.user.cart.find(sku => sku.id === this.sku.id)

      if (!cartItem) {
        return 0
      }

      return cartItem.inCart
    },
    noneInCart () {
      return this.inCart === 0
    },
    hasAllInCart () {
      return this.inCart === this.inStock && this.inStock > 0
    },
    stockAvailableRange () {
      const maxInList = 99
      return [...Array(this.inStock + 1).keys()].slice(0, maxInList)
    }
  },
  methods: {
    ...mapActions([
      'setItemCount'
    ]),
    setInCart (count) {
      if (count < 0) { return }
      if (count > this.inStock) { return }
      return this.setItemCount({ sku: this.sku, count })
    }
  }
}
</script>

<style>
  .in-cart {
    text-align-last: center;
    width: 50px;
  }

  .sold-out {
    opacity: 1;
    cursor: default;
  }
</style>
