<template>
  <div class="sku-colors">
    <color-swatch v-for="(color, i) in colorList" :key="i" :color="color" />
  </div>
</template>

<script>

export default {
  props: {
    sku: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    colorList () {
      const colorAttributes = ['color_face', 'color_muzzle', 'color_decorations']

      return colorAttributes.map(attribute => this.sku.attributes[attribute])
    }
  }
}
</script>

<style scoped>
  .sku-colors {
    display: flex;
    height: 10px;
  }
  .color-swatch {
    display: flex;
    flex: 1;
  }
</style>
