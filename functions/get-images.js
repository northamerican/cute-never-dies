const recursiveReaddir = require('recursive-readdir')

exports.handler = ({ body }, context, callback) => {
  const { skuId } = JSON.parse(body)
  const isDsStore = file => file.includes('DS_Store')

  recursiveReaddir(`./static/product-images/${skuId}/`, [isDsStore], (error, files) => {
    if (error) {
      callback(Error('Error: Could not read product images directory'))
    }
    const productImages = files.map(path => path.replace('static', '')).sort()

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(productImages),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  })
}
