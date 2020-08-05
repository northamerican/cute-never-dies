<template>
  <section class="section error-page">
    <div class="content has-text-centered">
      <p>
        <img width="276" height="350" class="contact-logo" src="/img/sad-mac.png">
      </p>
      <h1 class="has-text-white">
        Page not found
      </h1>
    </div>
  </section>
</template>

<script>
export default {
  head: {
    title: 'page not found'
  }
}
</script>

<style scoped>
  .error-page {
    height: 100vh;
    background: black;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
