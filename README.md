# cute-never-dies

https://www.cuteneverdies.com source code

[JAMstack](https://en.wikipedia.org/wiki/Netlify#Jamstack) online store made with:
[Nuxt](https://github.com/nuxt/nuxt.js/), [Sass](https://github.com/sass/sass) and [Bulma](https://github.com/jgthms/bulma). 
Payments processed with [Stripe](https://stripe.com).

![](https://cuteneverdies.netlify.app/hero-images/home.jpg)

## Build Setup

### Repo setup
- Copy/Fork this repo
- Install dependencies `yarn install`

### Stripe setup
- Create an account with Stripe
- Copy .env.example to .env
- Paste your Stripe publishable keys and secret keys to your .env file

### Netlify setup
- Create Netlify site using a fork of this repo
- Copy environment variables (in .env) to the environment variables in your Netflify Build & Deploy settings page.
- Install netlify-cli: https://docs.netlify.com/cli/get-started/#obtain-a-token-via-the-command-line

### Stripe shipping callback setup (optional)
- Specify the location of your order settings callback if you wish to use the feature on Stripe: https://dashboard.stripe.com/settings/orders
- https://your-netlify-app.netlify.app/.netlify/functions/get-shipping-rates

## Run
- Serve with hot reload at localhost:3000 -> `netlify dev`
