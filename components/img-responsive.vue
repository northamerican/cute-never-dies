<template>
  <img
    :srcset="`
      ${sharpUrl}${size(1)}?url=${src}&quality=${quality},
      ${sharpUrl}${size(2)}?url=${src}&quality=${quality} 2x
    `"
    :width="size(1)"
    :src="`${sharpUrl}${size(1)}?url=${src}&quality=${quality}`"
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
import shopConfig from '~/shop.public.config.js'

// ! images with 'position' should also have a width set, as the v-resize directive

const defaultQuality = 90
const { imageSizes } = shopConfig
const getValidSize = (imgWidth, imageSizes) =>
  imageSizes.reduce((solution, current) =>
    imgWidth > solution ? current : solution)

export default {
  inheritAttrs: false,
  props: {
    src: {
      type: String,
      required: true
    },
    width: {
      type: [String, Number],
      default: () => getValidSize(0, imageSizes)
    },
    quality: {
      type: [String, Number],
      default: () => defaultQuality
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
  data () {
    const { width } = this

    return {
      sharpUrl: '/api/sharp/resize/',
      elementWidth: width,
      targetWidth: {},
      largestLoaded: {}
    }
  },
  computed: {
    minHeightToUnit () {
      const { minHeight } = this
      const isNum = !isNaN(minHeight)

      return isNum ? `${minHeight}px` : minHeight
    }
  },
  methods: {
    handleResize ($img) {
      this.elementWidth = $img.clientWidth
    },
    size (density) {
      const targetWidth = getValidSize(this.elementWidth * density, imageSizes)
      const largestLoaded = this.largestLoaded[density]

      this.largestLoaded[density] = Math.max(largestLoaded || 0, targetWidth)
      this.targetWidth[density] = this.largestLoaded[density]

      return this.targetWidth[density]
    }
  }
}
</script>

<style scoped lang="sass">
  // img
  //   width: auto
  //   // keep images withing the constraints of the viewport, modals
  //   max-height: calc(100vh - #{$modal-content-spacing-mobile})
  //   +tablet
  //     max-height: calc(100vh - #{$modal-content-spacing-tablet})
</style>
