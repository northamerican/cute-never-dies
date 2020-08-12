<template>
  <img
    :srcset="computedSrcset"
    :src="src"
    :sizes="computedSizes"
    :alt="$attrs.alt"
    :width="$attrs.width"
    :style="{
      'object-fit': position ? 'cover': 'fill',
      'object-position': position ? position : '50% 50%'
    }"
    class="img-responsive"
  >
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    src: {
      type: String,
      required: true
    },
    srcset: {
      type: Array,
      required: true,
      default: () => []
    },
    sizes: {
      type: Object,
      default: undefined
    },
    densities: {
      type: Array,
      default: () => [1, 2]
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
    computedSrcset () {
      const { src, srcset } = this

      return srcset
        .flatMap(size => this.densities.map(density => size * density))
        .sort((a, b) => b - a)
        .map(size => `${src}?nf_resize=fit&w=${size} ${size}w`)
        .join(', ')
    },
    computedSizes () {
      if (!this.sizes) {
        return null
      }

      const { desktop, tablet, mobile } = this.sizes

      return (desktop ? `(min-width: 1024px) ${desktop}, ` : '') +
        (tablet ? `(min-width: 769px) ${tablet}, ` : '') +
        (mobile || '100vw')
    }
  }
}
</script>

<style scoped lang="sass">
  .img-responsive
    width: auto
    // Constain heights of images
    .modal &
      max-height: calc(100vh - #{$modal-content-spacing-mobile})
      +tablet
        max-height: calc(100vh - #{$modal-content-spacing-tablet})
</style>
