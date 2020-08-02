<template>
  <footer class="footer has-text-centered has-text-grey">
    <nav class="navbar footer-navbar">
      <div class="navbar-menu is-shadowless">
        <nuxt-link :to="localePath('terms')" class="navbar-item">
          {{ $t('Terms and Conditions') }}
        </nuxt-link>
        <nuxt-link :to="localePath('contact')" class="navbar-item">
          {{ $t('Contact') }}
        </nuxt-link>
        <!-- <a class="navbar-item" href="https://www.facebook.com/cuteneverdies" target="_blank">
          FB
        </a>
        <a class="navbar-item" href="https://www.facebook.com/cuteneverdies" target="_blank">
          IG
        </a> -->
      </div>
    </nav>
    <br>
    <p>{{ siteName }} • {{ copyrightYears }}</p>
    <p>{{ $t('A division of') }} <a href="http://compluter.com" target="_blank" rel="noopener">compluter.com</a></p>
  </footer>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    copyrightYears (state) {
      const currentYear = (new Date()).getFullYear()
      return state.yearCreated + (currentYear > state.yearCreated ? `-${currentYear}` : '')
    },
    ...mapState([
      'siteName',
      'yearCreated'
    ])
  }
}
</script>

<style scoped>
  .footer-navbar {
    background: none;
  }
  .navbar-menu {
    display: flex;
    justify-content: center;
    background: transparent;
  }
</style>
