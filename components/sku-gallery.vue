<template>
  <div v-if="hasImages" class="gallery">
    <div v-for="image in images" :key="image" class="image-wrapper">
      <a :href="image">
        <img-responsive :src="image" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sku: {
      type: Object,
      default: () => ({})
    },
    limit: {
      type: [Number, Array],
      default: () => Infinity
    }
  },
  data: () => ({
    images: [],
    hasImages: false
  })
  // async created () {
  //   const skuId = this.sku.id
  //   const response = await fetch(`/product-images/${skuId}/manifest.json`)
  //   const filenames = await response.json()
  //   const limit = Array.isArray(this.limit) ? this.limit : [0, this.limit]

  //   this.images = filenames.slice(...limit)
  //   this.hasImages = filenames.length > 0
  // }
}
</script>

<style scoped lang="sass">
  .image-wrapper
    text-align: center
</style>
