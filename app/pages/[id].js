import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Container, Row, Col, Jumbotron, Table } from 'react-bootstrap'
import { Query } from 'urql'
import gql from 'graphql-tag'
import QRCode from 'qrcode.react'
import config from '../conf/config'
import withUrqlClient from '../hooks/withUrqlClient'
import LoadingMessage from '../components/LoadingMessage'
import DataError from '../components/DataError'
import { unixToDate, jsonToDate, formatAsFullDate, formatAsDateTime } from '../utils/dates'
import { verify } from '../utils/pgp'
import { linkToKey } from '../utils/links'
import ID from '../utils/id'

const Document = ({ id }) => {
  const [ status, setStatus ] = useState( { verified: false, valid: false, keyId: null, msg: 'Цифровая подпись проверяется' })

  // Digital signature verification
  const verifySignature = async (data, signature) => {
    const { valid, keyId } = await verify(data, signature)
    if (!keyId) {
      setStatus({ verified: true, valid: false, keyId, msg: 'Цифровая подпись отсутствует' })
    } else {
      setStatus({ verified: true, valid, keyId, msg: valid ? 'Цифровая подпись проверена' : 'Цифровая подпись не подтверждена' })
    }
  }

  const query = gql`
    query($id: String!) {
      documentObject(id: $id) {
        id
        institution
        degree
        honours
        series
        number
        issue_number
        issue_date
        first_name
        middle_name
        last_name
        specialty
        qualification
        protocol_number
        protocol_date
        chairman
        head

        document {
          dateCreated
          dateUpdated
          isRevoked

          data
          signature

          history(orderBy: date) {
            id
            date
            type
          }
        }
      }
    }
  `

  const fullName = row => {
    const name = []
    for (let f of ['last_name', 'first_name', 'middle_name'])
      if (row[f])
        name.push(row[f])
    return name.join(' ')
  }

  const typeMap = {
    'Create': 'Зарегистрирован',
    'Update': 'Внесены изменения',
    'Revoke': 'Аннулирован',
    'Remove': 'Удален',
  }

  return (
    <Query query={query} variables={{id}} requestPolicy={config.api?.requestPolicy}>
      {({ data, fetching, error }) => {
        if (fetching) return <LoadingMessage />
        if (error) return <DataError>{error.message}</DataError>
        if (!data?.documentObject) return <DataError>Document not found</DataError>

        let d = data.documentObject

        if (!status.verified) {
          verifySignature(d.document.data, d.document.signature)
        }

        // Update ../conf/hints.js if this list was changed
        const program = degree => {
          switch (degree.toLowerCase(degree)) {
            case 'бакалавр': return 'бакалавриата по направлению подготовки'
            case 'магистр': return 'магистратуры по направлению подготовки'
            case 'специалист': return 'специалитета по специальности'
            case 'профессор': return 'профессуры по направлению подготовки'
          }
          return `обучения по направлению`
        }

        return (
          <>
            <div
              className='text-center'
              style={d.document.isRevoked && {
                backgroundImage: 'url("/images/cancelled.png")',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '20rem'
              }}>
              <h4 className='text-uppercase'>Российская федерация</h4>
              <h4>{d.institution}</h4>
              <h1 className='text-uppercase'>Диплом {d.degree.toLowerCase()}а</h1>
              {d.honours && <div className='text-danger' style={{fontSize: '1.75rem'}}>с отличием</div>}
              <div className='mt-3 text-monospace text-danger' style={{fontSize: '1.1rem'}}>{d.series} {d.number}</div>
              <h5 className='mt-3 text-uppercase'>Документ об образовании и о квалификации</h5>
              <div className='mt-3 font-italic'>Регистрационный номер</div>
              <div className='font-weight-bolder'>{d.issue_number}</div>
              <div className='mt-2 font-italic'>Дата выдачи</div>
              <div className='font-weight-bolder'>{formatAsFullDate(jsonToDate(d.issue_date))}</div>

              <hr />

              <div>Настоящий диплом свидетельствует о том, что</div>
              <div className='font-weight-bolder' style={{fontSize: '1.2rem'}}>{fullName(d)}</div>
              <div>освоил(а) программу {program(d.degree)}</div>
              <div className='my-1 font-weight-bolder'>{d.specialty}</div>
              <div>и успешно прошел(ла) государственную итоговую аттестацию</div>
              <div className='mt-3'>Решением Государственной экзаменационной комиссии</div>
              <div>присвоена квалификация</div>
              <div className='mt-2 font-weight-bolder' style={{fontSize: '1.1rem'}}>{d.qualification}</div>
              <div className='mt-3'>Протокол № <span className='font-weight-bolder'>{d.protocol_number} </span>
                   от <span className='font-weight-bolder'>{formatAsFullDate(jsonToDate(d.protocol_date))}</span></div>
              <div className='mt-3'>Председатель Государственной экзаменационной комиссии {d.chairman}</div>
              <div>Руководитель образовательной организации {d.head}</div>

              <hr />

              <div className='d-inline-flex'>
                <div style={{flex: 1.5}} className='mr-3'>
                  <div className='text-uppercase font-weight-bolder'>Данные о регистрации в блокчейне</div>
                  <Table bordered size='sm'>
                    <tbody>
                      {d.document.history.map(i =>
                        <tr key={i.id}>
                          <td>{formatAsDateTime(unixToDate(i.date))}</td>
                          <td>{typeMap[i.type]}</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                  <div>Документ {new ID(id).toPrintableString()}</div>
                  <div className='font-weight-bolder'>{status.msg}</div>
                  { status.keyId &&
                    <div>(<span className='text-monospace'>keyId:&nbsp;{linkToKey(status.keyId, status.valid)}</span>)</div>
                  }

                </div>
                <div style={{flex: 0.5}} className='ml-3'>
                  <QRCode value={`${config.view.uri}/${d.id}`} size={96} />
                </div>
              </div>

            </div>
          </>
        )
      }}
    </Query>
  )
}

const Index = () => {
  const router = useRouter();
  const id = new ID(router.query.id)

  return (
    <>
      <Head>
        <title>{`${id.toPrintableString()} - просмотр документа`}</title>
        <link rel="icon" href="/favicon.ico" />
        <script src='https://cdnjs.cloudflare.com/ajax/libs/openpgp/4.6.2/openpgp.min.js'></script>
      </Head>
      <Container as={Jumbotron}>
        <Document id={id.toString()} />
      </Container>
    </>
  )
}

export default withUrqlClient(Index)
