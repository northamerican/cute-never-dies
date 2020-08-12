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
          <div v-for="images in chunk(Object.values(imageList), imageList.length % 2 === 0 ? 2 : 3)" :key="images[0]" class="columns">
            <div v-for="image in images" :key="image" class="column">
              <nuxt-link :to="localePath(`/shop?sku=${skuId}`)" event="" @click.native="openSkuModal(getSkuById(skuId))">
                <img-responsive
                  :srcset="[660, 432]"
                  :src="image"
                  :sizes="{
                    desktop: images.length === 3 ? '33vw': '50vw'
                  }"
                  min-height="100%"
                  position="50% 50%"
                />
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Vue from 'vue'
import { chunk } from 'lodash'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  fetch () {
    this.skus.forEach(async (sku) => {
      Vue.set(this.skuImages, sku.id, await this.getImages({
        sku,
        url: this.$config.url
      }))
    })
  },
  data: () => ({
    skuImages: {}
  }),
  computed: {
    chunk: () => chunk,
    ...mapState([
      'skus',
      'user'
    ])
  },
  methods: {
    ...mapMutations([
      'openSkuModal'
    ]),
    ...mapActions([
      'getImages'
    ]),
    getSkuById (id) {
      return this.skus.find(sku => sku.id === id)
    }
  },
  head: {
    title: 'gallery'
  }
}
</script>

<style scoped>

</style>
