// PGP functions

import config from '../conf/config'

// Sign string value with PGP key
const sign = async (data, privKey) => {
  let signature

  try {
    // Read private key
    const { keys: [privateKey] } = await openpgp.key.readArmored(privKey)

    // Sign message
    const { signature: detachedSignature } = await openpgp.sign({
      message: openpgp.cleartext.fromText(data),
      privateKeys: [privateKey],
      detached: true,
      armor: false,
    });

    // Convert signature object into hex string (to be stored)
    const signatureBytes = await detachedSignature.packets.write()
    signature = '0x' + Buffer.from(signatureBytes).toString('hex')
  } catch (e) {
    // In case of invalid/missing key return empty signature
    signature = '0x'
  }

  return { signature }
}

const verify = async (data, signature) => {
  let valid, keyId

  try {
    // Create signature object from hex string
    const signatureBytes = Uint8Array.from(Buffer.from(signature.replace(/^0x/, ''), 'hex'))
    const detachedSignature = await openpgp.signature.read(signatureBytes)

    // Extract keyId
    keyId = detachedSignature.packets[0].issuerKeyId.toHex()

    // Get key from keyserver
    const hkp = new openpgp.HKP(config.pgp.keyserver)
    const publicKeyArmored = await hkp.lookup({ keyId })

    // Verify data
    const verified = await openpgp.verify({
      message: openpgp.cleartext.fromText(data),
      signature: detachedSignature,
      publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys
    })

    valid = verified.signatures[0].valid
    keyId = verified.signatures[0].keyid.toHex()
  } catch (e) {
    // In case of fatal error return default values
    valid = false
    keyId = null
  }

  return { valid, keyId }
}

export {
  sign,
  verify,
}
