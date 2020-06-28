//
// React hook to provide Web3 client
//
import { useState, useEffect } from 'react'
import Web3 from 'web3'
import contractDefinition from '../contracts/DocumentManager.json'

// Get injected web3 provider
const getWeb3 = () => {
  const { web3 } = window
  if (typeof web3 !== 'undefined')
    return new Web3(web3.currentProvider)
  throw new Error('No web3 provider')
}

// Get contract instance
const getContract = async (web3, contractDefinition) => {
  const networkId = await web3.eth.net.getId()
  const deployedAddress = contractDefinition.networks[networkId].address
  const instance = new web3.eth.Contract(
    contractDefinition.abi,
    deployedAddress
  )
  return instance
}

// A hook that provides an API for updating the global state
const useWeb3Client = () => {
  const [ state, setState ] = useState({
    loading: true,
    error: null,
    web3: null,
    netId: null,
    accounts: null,
    contract: null,
  })

  const accountsChangedHandler = () => initWeb3()
  const networkChangedHandler = () => initWeb3()

  const addListeners = () => {
    if (typeof ethereum !== 'undefined' && typeof (ethereum.enable) === 'function') {
      ethereum.enable()
        .then(() => {
          if (ethereum.isMetaMask) {
            // ethereum.autoRefreshOnNetworkChange = false
            // ethereum.addListener('networkChanged', networkChangedHandler)
            // ethereum.addListener('accountsChanged', accountsChangedHandler)
          }
        })
    }
  }

  const removeListeners = () => {
    if (typeof ethereum !== 'undefined') {
      if (ethereum.isMetaMask) {
        // ethereum.removeListener('networkChanged', networkChangedHandler)
        // ethereum.removeListener('accountsChanged', accountsChangedHandler)
      }
    }
  }

  const initWeb3 = async () => {
    try {
      addListeners()
      const web3 = await getWeb3()
      web3.eth.handleRevert = true
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()
      const contract = await getContract(web3, contractDefinition)
      setState({ web3, netId, accounts, contract, loading: false, error: null })
    } catch (e) {
      // Log original error, but show some generic message
      console.log(`[Web3] ${e.message}`)
      const error = new Error(
        `Ошибка инициализации блокчейн-провайдера, аккаунта или контракта. ` +
        `Убедитесь, что установлен MetaMask/Mist, выбрана правильная сеть, ` +
        `а текущий аккаунт имеет право на работу с системой. `
      )
      setState({ web3: null, netId: null, accounts: null, contract: null, loading: false, error })
    }
  }

  useEffect(() => {
    initWeb3()
    return removeListeners
  }, [])

  return state
}

export default useWeb3Client
