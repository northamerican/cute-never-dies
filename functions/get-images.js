
const fs = require('fs').promises

exports.handler = async ({ body }) => {
  const productImagesDevDir = './static/product-images'
  const productImagesProdDir = '/product-images'

  let productImagesDir = ''

  try {
    await fs.stat(productImagesDevDir)
    productImagesDir = productImagesDevDir
  } catch (err) {
    productImagesDir = productImagesProdDir
  }

  const { skuId } = JSON.parse(body)
  const data = await fs.readFile(`${productImagesDir}/${skuId}/manifest.json`)
  // 'static' served as root by nuxt
  const imagePaths = JSON.parse(data).map(img => `${'./product-images'}/${skuId}/${img}`)

  return {
    statusCode: 200,
    body: JSON.stringify(imagePaths),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
