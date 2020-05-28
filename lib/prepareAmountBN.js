const BN = require('./BN')
const toBN = require('./toBN')
const DECIMAL_PLACES = 8

module.exports = price => toBN(price)
  .decimalPlaces(DECIMAL_PLACES, BN.ROUND_HALF_UP)