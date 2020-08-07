<template>
  <img
    :srcset="computedSrcset"
    :src="computedSrc"
    :width="computedWidth"
    :alt="$attrs.alt"
    :style="{
      'min-height': minHeightToUnit,
      'object-fit': position ? 'cover': 'fill',
      'object-position': position ? position : '50% 50%'
    }"
    class="img-responsive"
  >
</template>

<script>
// import resize from 'vue-resize-directive'
// import shopConfig from '~/shop.public.config.js'

// ! images with 'position' should also have a width set, as the v-resize directive

// const defaultQuality = 90
// const { imageSizes } = shopConfig
// const getValidSize = (imgWidth, imageSizes) =>
//   imageSizes.reduce((solution, current) =>
//     imgWidth > solution ? current : solution)

export default {
  inheritAttrs: false,
  props: {
    src: {
      type: String,
      required: true
    },
    width: {
      type: [String, Number],
      default: () => 0
      // default: () => getValidSize(0, imageSizes)
    },
    quality: {
      type: [String, Number],
      default: () => 0
      // default: () => defaultQuality
    },
    minHeight: {
      type: [String, Number],
      default: () => 0
    },
    position: {
      type: [String, Number, Boolean],
      default: false
    }
  },
  data: () => ({
  }),
  computed: {
    minHeightToUnit () {
      const { minHeight } = this
      const isNum = !isNaN(minHeight)

      return isNum ? `${minHeight}px` : minHeight
    },
    computedSrc () {
      const { src, width } = this
      return src + (width ? `?nf_resize=fit&w=${width}` : '')
    },
    computedSrcset () {
      return `
        ${this.computedSrc},
        ${this.computedSrc} 2x
      `
    },
    computedWidth () {
      const { width } = this
      return width ? width * 2 : null
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="sass">
  img
    // width: auto
    // keep images withing the constraints of the viewport, modals
    max-height: calc(100vh - #{$modal-content-spacing-mobile})
    +tablet
      max-height: calc(100vh - #{$modal-content-spacing-tablet})
</style>
