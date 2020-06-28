import Head from 'next/head'
import { useState, useEffect } from 'react'
import config from '../conf/config'
import Header from './Header'
import useWeb3Client from '../hooks/useWeb3Client'
import LoadingMessage from './LoadingMessage'
import DelayedObject from './DelayedObject'
import DataError from './DataError'

const layoutStyle = {
  // margin: 20,
  // padding: 20,
  // border: '1px solid #DDD'
};

const Layout = props => {
  const title = config.title
  const [ accessGranted, setAccessGranted ] = useState(false)

  const errorObject = msg => (
    <>
      <Head>
        <title>{'Доступ запрещен - ' + title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={layoutStyle}>
        <DataError>
          {msg}
          <hr />
          Если вы считаете, что это ошибка, обратитесь к администратору системы.
        </DataError>
      </div>
    </>
  )

  // Check blockchain provider
  const { accounts, loading, error, contract } = useWeb3Client()
  if (loading) return <LoadingMessage />
  if (error) return errorObject(error.message)

  // Check for access
  const checkAccess = async () => {
    try {
      setAccessGranted(await contract.methods.checkAccess().call({ from: accounts[0] }))
    } catch (e) {
    }
  }

  checkAccess()
  if (!accessGranted)
    return (
      <DelayedObject>
        {errorObject(`Аккаунт ${accounts[0]} не имеет прав доступа к системе.`)}
      </DelayedObject>
    )

  return (
    <>
      <Head>
        <title>{(props.title ? props.title + ' - ' : '') + title}</title>
        <link rel="icon" href="/favicon.ico" />
        <script src='https://cdnjs.cloudflare.com/ajax/libs/openpgp/4.6.2/openpgp.min.js'></script>
      </Head>
      <div style={layoutStyle}>
        <Header title={title} account={accounts[0]}/>
        {props.children}
      </div>
    </>
  )
}

export default Layout
