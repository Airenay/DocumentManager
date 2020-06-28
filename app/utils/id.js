import sha from 'sha.js'
import base32 from 'hi-base32'

// This class handles a document id to be used in URLs or printed.
// It should be unique, easy to read/spell, and short.
// So it hashes the source data first, then converts binary hash to array,
// then takes a part of it and uses base32 encoding to convert to ASCII.
// Printable version adds some dashes for easy to read.
class ID {
  constructor(id) {
    this.id = id ? id.replace(/-/g, '') : ''
  }

  from(data, size = 10) {
    let id = sha('sha256').update(data).digest().slice(0, size)
    this.id = base32.encode(id)
    return this
  }

  toString() {
    return this.id.toLowerCase()
  }

  toPrintableString() {
    return this.id.toUpperCase().match(/.{1,4}/g).join('-')
  }
}

export default ID
