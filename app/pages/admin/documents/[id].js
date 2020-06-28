import { useRouter } from 'next/router'
import { useState } from 'react'
import withUrqlClient from '../../../hooks/withUrqlClient'
import Layout from '../../../components/Layout'
import Document from '../../../components/Document'
import DocumentForm from '../../../components/DocumentForm'
import { useStorage } from '../../../hooks/useStorage'
import { jsonToDate } from '../../../utils/dates'
import { sign } from '../../../utils/pgp'
import ID from '../../../utils/id'

import useWeb3Client from '../../../hooks/useWeb3Client'
import LoadingMessage from '../../../components/LoadingMessage'
import DataError from '../../../components/DataError'

// Debug options
const CALL_CONTRACT = 1    // actually call contract methods
const USE_DEMO_VALUES = 0  // fill in the form with demo values

const demoValues = {
  institution: 'Межгалактический государственный университет',
  series: '000123',
  number: '2425437',
  issue_number: '13',
  issue_date: jsonToDate('1980-01-01T00:00:00.000Z'),
  last_name: 'Замарухин',
  first_name: 'Олег',
  middle_name: 'Кабардинович',
  specialty: '000007 Специальность, отсутствующая в списке',
  qualification: 'Инженер',
  degree: 'Магистр',
  honours: true,
  protocol_number: '5',
  protocol_date: new Date(),
  chairman: 'И.И.Петров',
  head: 'С.И.Иванов',
}

const Index = () => {
  const { storage } = useStorage()

  const router = useRouter();
  const id = new ID(router.query.id).toString()
  const [ state, setState ] = useState({
    show: (id == 'add'),
    mode: 'add',
    values: USE_DEMO_VALUES ? demoValues : {}
  })

  const { accounts, contract, loading, error } = useWeb3Client()
  if (loading) return <LoadingMessage />
  if (error) return <DataError>{error.message}</DataError>

  const add = () => {
    setState(state => ({
      ...state,
      show: true,
      mode: 'add',
      submitHandler: addHandler,
      values: demoValues,
      add: false,
    }))
  }

  const update = (id, data) => {
    // Convert original JSON data string to an object
    let values = JSON.parse(data)

    // convert date strings to Date objects
    const fixes = {
      issue_date: jsonToDate(values.issue_date),
      protocol_date: jsonToDate(values.protocol_date),
    }
    values = { ...values, ...fixes }

    // Open form
    setState(state => ({
      ...state,
      show: true,
      mode: 'update',
      submitHandler: updateHandler,
      id,
      values,
    }))
  }

  const revoke = id => {
    revokeHandler(id)
  }

  const remove = id => {
    removeHandler(id)
  }

  const addHandler = async ({values}) => {
    setState(state => ({ ...state, show: false }))

    // TODO: if values == originalValues, do nothing
    // if (isEqual(values, prevValues)) {
    //   alert('Изменений нет, обновление отменено')
    //   return
    // }

    const json = JSON.stringify(values)
    const id = new ID().from(json).toString()

    // Sign the data
    const { signature } = await sign(json, storage?.pgpKeys?.privKey)

    // Save data
    if (CALL_CONTRACT)
      try {
        await contract.methods.create(id, json, signature).send({ from: accounts[0] /*, gas: 200000*/ })
      } catch (error) {
        alert(error.reason ? error.reason : error.message)
      }
  }

  const updateHandler = async ({id, values}) => {
    setState(state => ({ ...state, show: false }))

    // TODO: if values == originalValues, do nothing
    // if (isEqual(values, prevValues)) {
    //   alert('Изменений нет, обновление отменено')
    //   return
    // }

    const json = JSON.stringify(values)

    // Sign the data
    const { signature } = await sign(json, storage?.pgpKeys?.privKey)

    // Update the data
    if (CALL_CONTRACT)
      try {
        await contract.methods.update(id, json, signature, '').send({ from: accounts[0] /*, gas: 200000*/ })
      } catch (error) {
        alert(error.reason ? error.reason : error.message)
      }
  }

  const revokeHandler = async id => {
    setState(state => ({ ...state, show: false }))

    // alert(`REVOKE document ${id}`)

    if (CALL_CONTRACT)
      try {
        await contract.methods.revoke(id, '').send({ from: accounts[0] /*, gas: 200000*/ })
      } catch (error) {
        alert(error.reason ? error.reason : error.message)
      }
  }

  const removeHandler = async id => {
    setState(state => ({ ...state, show: false }))

    // alert(`REMOVE document ${id}`)

    if (CALL_CONTRACT)
      try {
        await contract.methods.remove(id, '').send({ from: accounts[0] /*, gas: 200000*/ })
      } catch (error) {
        alert(error.reason ? error.reason : error.message)
      }
  }

  const cancelHandler = values => {
    setState(state => ({ ...state, show: false }))
  }

  return (
    <Layout title={`Документ ${id}`}>
      {!state.show &&
        <div>
          <Document id={id} addHandler={add} updateHandler={update} revokeHandler={revoke} removeHandler={remove} />
        </div>
      }
      {state.show &&
        <DocumentForm
          show={state.show}
          mode={state.mode}
          id={state.id}
          values={state.values}
          onSubmit={(state.mode == 'add') ? addHandler : state.submitHandler}
          onHide={cancelHandler}
        />
      }
    </Layout>
  )
}

export default withUrqlClient(Index)
