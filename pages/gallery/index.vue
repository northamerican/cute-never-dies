<template>
  <main>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ $t('Gallery') }}
          </h1>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div v-for="(imageList, skuId) in skuImages" :key="`${skuId}-${imageList[0]}`">
          <!-- <h1 class="title">{{ skuId }}</h1> -->
          <div v-for="images in chunk(Object.values(imageList), imageList.length % 2 === 0 ? 2 : 3)" :key="images[0]" class="columns">
            <div v-for="image in images" :key="image" class="column">
              <a :href="`shop/${skuId}`">
                <img-responsive
                  :src="image"
                  min-height="100%"
                  position="50% 50%"
                  class="gallery-image"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Vue from 'vue'
import chunk from 'lodash/chunk'

import { mapState } from 'vuex'

export default {
  data: () => ({
    skuImages: {},
    chunk
  }),
  computed: {
    ...mapState([
      'skus',
      'user'
    ])
  },
  created () {
    this.skus.forEach(async (sku) => {
      const { url } = this.$config
      const skuId = sku.id
      const response = await fetch(`${url}/product-images/${skuId}/manifest.json`)
      const filenames = await response.json()
      const filenamesWithPaths = filenames.map(filename => `/product-images/${skuId}/${filename}`)

      Vue.set(this.skuImages, skuId, filenamesWithPaths)
    })
  },
  head: {
    title: 'gallery'
  }
}
</script>

<style scoped>
  .gallery-image {
    height: 100%;
  }
</style>
