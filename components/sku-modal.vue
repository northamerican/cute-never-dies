<template>
  <div v-if="modals && modals.sku" class="modal is-active">
    <div class="modal-background" aria-label="close" @click="dismissSkuModal" />
    <div class="modal-content box">
      <sku-page :sku="modals.sku" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState([
      'modals'
    ])
  },
  methods: {
    ...mapMutations([
      'dismissSkuModal'
    ])
  }
}
</script>

<style scoped lang="sass">
  .modal
    z-index: 200

  .modal-background
    cursor: pointer

  .modal-content
    width: 80vw
    margin: 0 20px
</style>
