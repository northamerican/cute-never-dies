import { readdirSync, writeFileSync } from 'fs'

import { siteName } from './shop.public.config.js'
import en from './locales/en.json'
// import fr from './locales/fr.json'

const isDev = process.env.NODE_ENV !== 'production'

// In each product images directory,
// create a json file with a list of image file names
function createProductImageManifests () {
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
  mode: 'spa',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  fetchOnServer: false,
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
      { name: 'description', content: 'Original mask designs made in Montreal. Made from machine cut, hand-shaped and assembled acrylic plastic.' }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '76x76', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ed0064' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com/' }
    ]
  },

  publicRuntimeConfig: {
    url: isDev ? 'http://localhost:3000' : '',
    // NETLIFY_FUNCTIONS_BASE_URL: process.env.NETLIFY_FUNCTIONS_BASE_URL,
    // STRIPE_API_VERSION: process.env.STRIPE_API_VERSION,
    STRIPE_IS_LIVE_MODE: process.env.STRIPE_IS_LIVE_MODE,
    STRIPE_PUBLISHABLE_KEY_TEST: process.env.STRIPE_PUBLISHABLE_KEY_TEST,
    STRIPE_PUBLISHABLE_KEY_LIVE: process.env.STRIPE_PUBLISHABLE_KEY_LIVE
  },
  // privateRuntimeConfig: {
  //   STRIPE_SECRET_TEST_KEY: process.env.STRIPE_SECRET_TEST_KEY,
  //   STRIPE_SECRET_LIVE_KEY: process.env.STRIPE_SECRET_LIVE_KEY
  // },

  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    { src: '~/plugins/nuxt-client-init.js', ssr: false }
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
    // '@aceforth/nuxt-netlify',
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    'nuxt-purgecss'
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
    }],
    'nuxt-webfontloader'
  ],

  styleResources: {
    sass: './assets/sass/variables.sass'
  },
  css: [
    '~/assets/sass/bulma.sass'
  ],
  loading: { color: '#ed0064' },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    // postcss: {
    //   preset: {
    //     features: {
    //       customProperties: false
    //     }
    //   }
    // },
    extend (config, { isServer }) {
      if (isServer) {
        createProductImageManifests()
      }
    }
  },

  netlify: {
  },

  webfontloader: {
    google: {
      families: ['Rubik:400,400i,500']
    }
  }
}
