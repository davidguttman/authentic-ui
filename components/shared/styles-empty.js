var styles = require('./styles')

module.exports = Object.keys(styles).reduce(function (acc, k) {
  acc[k] = ''
  return acc
}, {})
