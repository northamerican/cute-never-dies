<template>
  <main>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Contact
          </h1>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns has-text-centered-touch">
          <div class="column is-2 is-offset-3-desktop is-hidden-touch">
            <img class="contact-logo" src="/img/cute-never-dies.svg">
          </div>
          <div class="column is-6-desktop is-offset-1-desktop">
            <div class="content">
              <h3>Questions, comments, sales?</h3>
              <h5 class="is-marginless">
                E-mail
              </h5>
              <a class="is-size-6" href="mailto:meow@cuteneverdies.com">meow@cuteneverdies.com</a>

              <h5 class="is-marginless">
                <br>Social media
              </h5>
              <a class="is-size-6" href="https://www.facebook.com/cuteneverdies" target="_blank">Facebook</a> •
              <a class="is-size-6" href="https://www.instagram.com/cuteneverdies" target="_blank">Instagram</a><br>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="hero is-white">
      <div class="hero-body hero-body--hero-image">
        <div class="container">
          <img
            src="hero-images/contact.jpg"
            width="768"
            alt=""
            min-height="350"
            position="30% 50%"
          >
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  head: {
    title: 'contact'
  }
}
</script>

<style scoped>
  .contact-logo {
    max-width: 220px;
  }

  .hero-body--hero-image {
    padding: 0;
  }
</style>
