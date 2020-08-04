<template>
  <img
    :srcset="`
      ${src}?nf_resize=fit&w=300,
      ${src}?nf_resize=fit&w=600 2x
    `"
    :src="`${src}?nf_resize=fit&w=300`"
    :alt="$attrs.alt"
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
  },
  methods: {
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
