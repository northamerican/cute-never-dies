import { readdirSync, writeFileSync } from 'fs'

import shopConfig from './shop.public.config.js'
import en from './locales/en.json'
// import fr from './locales/fr.json'

const { siteName } = shopConfig

// In each product images directory,
// create a json file with a list of image file names
function createProductImagesManifest () {
  const productImagesDir = './static/product-images'
  const productImagesManifestFilename = 'manifest.json'

  const getDirectories = source =>
    readdirSync(source, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

  getDirectories(productImagesDir).forEach((dir) => {
    const images = readdirSync(`${productImagesDir}/${dir}`)
      .filter(file => !file.includes(productImagesManifestFilename))

    writeFileSync(`${productImagesDir}/${dir}/${productImagesManifestFilename}`, JSON.stringify(images))
  })
}

export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: siteName,
    titleTemplate: `%s - ${siteName}`,
    htmlAttrs: {
      lang: () => this.i18n.locale
    },
    script: [
      { src: 'https://js.stripe.com/v3/', defer: true }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // publicRuntimeConfig: {
  //   URL: process.env.URL,
  //   NETLIFY_FUNCTIONS_BASE_URL: process.env.NETLIFY_FUNCTIONS_BASE_URL,
  //   STRIPE_API_VERSION: process.env.STRIPE_API_VERSION,
  //   STRIPE_PUBLISHABLE_TEST_KEY: process.env.STRIPE_PUBLISHABLE_TEST_KEY,
  //   STRIPE_PUBLISHABLE_LIVE_KEY: process.env.STRIPE_PUBLISHABLE_LIVE_KEY
  // },

  // privateRuntimeConfig: {
  //   STRIPE_SECRET_TEST_KEY: process.env.STRIPE_SECRET_TEST_KEY,
  //   STRIPE_SECRET_LIVE_KEY: process.env.STRIPE_SECRET_LIVE_KEY
  // },

  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['nuxt-i18n', {
      injectAs: 'i18n',
      locales: [
        {
          code: 'en',
          iso: 'en-US',
          name: 'English'
        }
        // {
        //   code: 'fr',
        //   iso: 'fr-CA',
        //   name: 'français'
        // }
      ],
      vueI18n: {
        messages: {
          en
          // fr
        },
        fallbackLocale: 'en',
        silentTranslationWarn: true
      },
      defaultLocale: 'en',
      noPrefixDefaultLocale: true
    }]
  ],

  styleResources: {
    sass: './assets/sass/variables.sass'
  },
  css: [
    '~/assets/sass/bulma.sass'
  ],
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    extend (config, { isServer }) {
      if (isServer) {
        createProductImagesManifest()
      }
    }
  }
}
