<template>
  <section class="mask-illustration section">
    <svg>
      <use
        v-bind="{ 'xlink:href': `/mask-illustration/mask-illustration--${sku.product}.svg#mask` }"
        :style="`
          --color_muzzle: ${colorsAda[sku.attributes.color_muzzle]};
          --color_decorations: ${colorsAda[sku.attributes.color_decorations]};
          --color_face: ${colorsAda[sku.attributes.color_face]};
          --color_nose: ${colorsAda[sku.attributes.color_nose]};
        `"
      />
    </svg>

    <div class="content mask-illustration-caption mask-illustration-caption--strap">
      <p class="title is-5">
        {{ $t('maskIllustration.strap.title') }}
      </p>
      <p class="subtitle">
        {{ $t('maskIllustration.strap.subtitle') }}
      </p>
    </div>

    <div class="content mask-illustration-caption mask-illustration-caption--chin">
      <p class="title is-5">
        {{ $t('maskIllustration.chin.title') }}
      </p>
      <p class="subtitle">
        {{ $t('maskIllustration.chin.subtitle') }}
      </p>
    </div>

    <div class="content mask-illustration-caption mask-illustration-caption--plastic">
      <p class="title is-5">
        {{ $t('maskIllustration.plastic.title') }}
      </p>
      <p class="subtitle">
        {{ $t('maskIllustration.plastic.subtitle') }}
      </p>
    </div>

    <div class="content mask-illustration-caption mask-illustration-caption--size">
      <p class="title is-5">
        {{ $t('maskIllustration.size.title') }}
      </p>
      <p class="subtitle">
        {{ $t('maskIllustration.size.subtitle') }}
      </p>
    </div>
  </section>
</template>

<script>
import colorsAda from '~/assets/js/colors-ada'

export default {
  props: {
    sku: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    colorsAda
  })
}
</script>

<style scoped lang="sass">
  .mask-illustration
    width: 100%
    display: flex
    justify-content: center
    flex-direction: column
    +desktop
      flex-direction: row
      position: relative

  .mask-illustration svg
    width: 100%
    height: 50vw
    margin-bottom: 40px
    +desktop
      width: 660px
      height: 500px

  .mask-illustration-caption
    +desktop
      position: absolute

      &--strap
        transform: translate(345px, 230px)
      &--chin
        transform: translate(-300px, 420px)
        text-align: right
      &--plastic
        transform: translate(90px, 35px)
      &--size
        transform: translate(-330px, 180px)
        text-align: right
</style>
