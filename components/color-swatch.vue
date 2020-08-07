<template>
  <div v-if="colorValue" :style="{ 'background-color': colorValue }" :title="startCase(color)" class="color-swatch" />
</template>

<script>
import { startCase } from 'lodash'
import colorsAda from '~/assets/js/colors-ada'

export default {
  props: {
    color: {
      type: String,
      default: () => ''
    }
  },
  data: () => ({
    colorsAda, startCase
  }),
  computed: {
    colorValue () {
      return this.colorsAda[this.color]
    }
  }
}
</script>
