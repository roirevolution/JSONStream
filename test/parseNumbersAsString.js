const test = require('tape')
const fs = require('fs')
const join = require('path').join
const file = join(__dirname, 'fixtures','numbers.json')
const JSONStream = require('../')

const jsonNumbers = [
  '12',
  '234234',
  '319845792347891723489716348961893468179364891236487123874618237461789236481236748891223234233'
]

test('parse numbers as strings', t => {
  const actual = []
  const parser = JSONStream.parse('*', null, {parseNumbersAsStrings: true})

  parser.on('data', value => {
    actual.push(value)
  })
  parser.on('end', () => {
    t.deepEqual(actual, jsonNumbers)

    t.end()
  })

  parser.write(`[${jsonNumbers.join(',')}]`)
  parser.end()
})

test('throws when attempting to parse an unsafely precise number', t => {
  let errorCount = 0
  let dataCount = 0
  const parser = JSONStream.parse('*')
    .on('data', data => {
      t.equals(data, Number(jsonNumbers[dataCount]))
      dataCount++
    })
    .on('error', e => {
      errorCount++
      t.assert(e.message.match(/unsafe to parse as a number/), 'correct error thrown')
    })
    .on('end', () => {
      t.equal(dataCount, 2)
      t.equal(errorCount, 1)

      t.end()
    })

  parser.write(`[${jsonNumbers.join(',')}]`)
  parser.end()
})
