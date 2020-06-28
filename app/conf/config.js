//
// Static configuration options
//

export default {
  // Compact application title
  title: 'DM',

  // Persistent storage key and defaults
  storageKey: 'dm',
  storageDefaults: {
    pageSize: 50,
  },

  // Table properties
  pageSizes: [ 10, 20, 30, 40, 50, 100, 1000 ],

  // External API configuration
  api: {
    // Graph Protocol API provider
    uri: 'http://localhost:8000/subgraphs/name/dm',

    // Authentication headers
    headers: {},

    // Cache update policy (URQL)
    requestPolicy: 'cache-and-network',
  },

  // View URL for QR codes
  view: {
    uri: 'http://localhost:3000',
  },

  // PGP options
  pgp: {
    keyserver: 'https://keys.openpgp.org',
  },

  // UI settings
  ui: {
    size: 'sm',
  },

  // External Ethereum block explorer
  //explorer: 'https://rinkeby.etherscan.io',

  // Debug options
  debug: [],
}
