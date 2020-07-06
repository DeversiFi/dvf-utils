const prepareAmount = require('./prepareAmount')
const BN = require('./BN')

const bfxUtils = require('bfx-api-node-util')

const assertConsitentWithBfx = price => {
  expect(prepareAmount(price)).toBe(
    BN(bfxUtils.prepareAmount(price)).toString()
  )
}

const testValue = (priceIn, priceOut) => {
  expect(prepareAmount(priceIn)).toBe(priceOut)
  assertConsitentWithBfx(priceIn)
}

const testConfigurableDecimals = (amountIn, amountOut, decimalPlaces) => {
  expect(prepareAmount(amountIn, decimalPlaces)).toBe(amountOut)
}
const testMaxDecimalsCorrection = (amountIn, amountOut, decimalPlaces) => {
  expect(prepareAmount(amountIn, decimalPlaces)).toBe(amountOut)
}

describe('prepareAmount', () => {
  it('rounds provided number (or numeric string) to 8 decimal points by default, and returns it as a string', () => {
    testValue(1, '1')
    testValue(0.5, '0.5')
    testValue(0.6, '0.6')
    testValue(0.00000001, '0.00000001')
    testValue(0.000000004, '0')
    testValue(0.000000014, '0.00000001')
    testValue(0.000000015, '0.00000001')
    testValue(0.000000014, '0.00000001')
    testValue(1000000.000000024, '1000000.00000002')
  })
  it('decimal place precision can be configuredn lower than 8', () => {
    testConfigurableDecimals(1, '1', 6)
    testConfigurableDecimals(0.5, '0.5', 6)
    testConfigurableDecimals(0.6, '0.6', 6)
    testConfigurableDecimals(0.00000001, '0', 6)
    testConfigurableDecimals(0.000000001, '0', 6)
    testConfigurableDecimals(0.000000004, '0', 6)
    testConfigurableDecimals(0.0000014, '0.000001', 6)
    testConfigurableDecimals(0.0000016, '0.000001', 6)
  })
  it('rounds provided number to max 8 decimal points if more than 8 was passed', () => {
    testMaxDecimalsCorrection(1, '1', 10)
    testMaxDecimalsCorrection(0.5, '0.5', 10)
    testMaxDecimalsCorrection(0.6, '0.6', 10)
    testMaxDecimalsCorrection(0.00000001, '0.00000001', 11)
    testMaxDecimalsCorrection(0.000000001, '0', 12)
    testMaxDecimalsCorrection(0.000000004, '0', 10)
    testMaxDecimalsCorrection(0.000000015, '0.00000001', 11)
    testMaxDecimalsCorrection(0.000000018, '0.00000001', 12)
    testMaxDecimalsCorrection(1000000.000000014, '1000000.00000001', 12)
  })
})
