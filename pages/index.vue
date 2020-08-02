<template>
  <div class="container">
    <div v-for="sku in skus" :key="sku.id">
      <sku-tile :sku="sku" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({

  }),
  computed: {
    ...mapState([
      'skus'
    ])
  },
  methods: {
  }
}
</script>

<style>
</style>
