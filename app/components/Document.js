import router from 'next/router'
import { useMemo } from "react"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Query } from 'urql'
import QRCode from 'qrcode.react'
import gql from 'graphql-tag'
import config from '../conf/config'
import Table from '../components/Table'
import LoadingMessage from '../components/LoadingMessage'
import DataError from '../components/DataError'
import { jsonToDate, unixToDate, formatAsDate, formatAsDateTime } from '../utils/dates'
import { linkToView } from '../utils/links'
import ID from '../utils/id'

const Data = props => {

  const truncate = value => (
    <div className='truncate'>{value}</div>
  )

  const boolValue = value => value ? 'Да' : 'Нет'

  const formatter = ({ cell: { row, value } }) => {
    if (row.original.format)
      return row.original.format(value)
    return value
  }

  const properties = [
    // { prop: 'id', desc: 'ID', format: truncate },
    { prop: 'institution', desc: 'Учебное заведение' },
    { prop: 'degree', desc: 'Степень' },
    { prop: 'honours', desc: 'С отличием', format: boolValue },
    { prop: 'series', desc: 'Серия' },
    { prop: 'number', desc: 'Номер' },
    { prop: 'issue_number', desc: 'Регистрационный №' },
    { prop: 'issue_date', desc: 'Дата регистрации', format: json => formatAsDate(jsonToDate(json)) },
    { prop: 'first_name', desc: 'Имя' },
    { prop: 'middle_name', desc: 'Отчество' },
    { prop: 'last_name', desc: 'Фамилия' },
    { prop: 'specialty', desc: 'Специальность' },
    { prop: 'qualification', desc: 'Квалификация' },
    { prop: 'protocol_number', desc: 'Протокол №' },
    { prop: 'protocol_date', desc: 'От', format: json => formatAsDate(jsonToDate(json)) },
    { prop: 'chairman', desc: 'Председатель комиссии' },
    { prop: 'head', desc: 'Глава учебного заведения' },
  ]

  const columns = useMemo(() => [
      { Header: 'Свойство', accessor: 'property' },
      { Header: 'Значение', accessor: 'value', Cell: formatter },
    ], []
  );

  const tdata = []
  const data = props.values

  for (let p of properties) {
    const row = {
      property: p.desc,
      value: data[p.prop],
      format: p.format || null,
    }
    tdata.push(row)
  }

  return <Table columns={columns} data={tdata} size={config.ui.size} bordered hover />
}


const History = props => {

  const types = {
    Create: <span>Создан</span>,
    Update: <span className='text-success'>Изменен</span>,
    Revoke: <span className='text-primary'>Аннулирован</span>,
    Remove: <span className='text-danger'>Удален</span>,
  }

  const hideRemoved = ({ cell: { value } }) => {
    if (!props.hide)
      return value
    if (value)
      return <del className='text-muted'>Данные удалены</del>
    return null
  }

  const columns = useMemo(() => [
      { Header: 'Дата', accessor: 'date', Cell: ({ cell: { value } }) => formatAsDateTime(unixToDate(value)) },
      { Header: 'Событие', accessor: 'type', Cell: ({ cell: { value } }) => types[value] || null },
      { Header: 'Причина', accessor: 'reason' },
    ], []
  );

  return <Table columns={columns} data={props.data} size={config.ui.size} bordered hover />
}


const Document = ({ id, ...props }) => {
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

        id
        dateCreated
        dateUpdated
        isRevoked
        isRemoved

        data
        signature

        document {
          history(orderBy: date) {
            id
            date
            type
            reason
            data
          }
        }
      }
    }
  `

  return (
    <Query query={query} variables={{id}} requestPolicy={config.api?.requestPolicy}>
      {({ data, fetching, error }) => {
        if (fetching) return <LoadingMessage />
        if (error) return <DataError>{error.message}</DataError>
        if (!data?.documentObject) return (
          <DataError>
            Документ не найден. Если он был только что создан или изменен, обновите страницу после подтверждения транзакции
          </DataError>
        )

        let d = data.documentObject

        return (
          <Container fluid>

            <div className='d-flex ml-3 my-3'>
              <div className='mr-auto'>
                  <Row><div className='truncate'><strong>Документ:</strong> {new ID(d.id).toPrintableString()}</div></Row>
                  <Row><strong>Дата создания:</strong> {formatAsDate(unixToDate(d.dateCreated))}</Row>
                  { d.dateUpdated &&
                    <Row><strong>Дата последнего изменения:</strong> {formatAsDate(unixToDate(d.dateUpdated))}</Row>
                  }
                  { d.isRevoked &&
                    <Row><span className='text-primary'><strong>Аннулирован</strong></span></Row>
                  }
                  { d.isRemoved &&
                    <Row><span className='text-danger'><strong>Удален</strong></span></Row>
                  }
              </div>
              <div className='ml-3'>
                {/*props.addHandler &&
                  <Button variant='primary' onClick={props.addHandler}>Добавить</Button>
                */}
                {props.updateHandler &&
                  <Button variant='success' size='sm' className='ml-2' onClick={() => props.updateHandler(d.id, d.data)}>Изменить</Button>
                }
                {props.revokeHandler &&
                  <Button variant='warning' size='sm' className='ml-2' onClick={() => props.revokeHandler(d.id)}>Аннулировать</Button>
                }
                {props.removeHandler &&
                  <Button variant='danger' size='sm' className='ml-2' onClick={() => props.removeHandler(d.id)}>Удалить</Button>
                }
                <Button variant='secondary' size='sm' className='ml-2' onClick={() => router.back()}>Назад</Button>
              </div>
            </div>

            <Row>
              <Col>
                { d.data &&
                  <Data values={d} />
                }
              </Col>
              <Col xs='auto'>
                <div className='d-flex justify-content-center'>
                  {linkToView(d.id, (
                    <QRCode
                      value={`${config.view.uri}/${d.id}`}
                      fgColor={d.isRevoked ? 'blue' : d.isRemoved ? 'red' : 'black' }
                    />
                  ))}
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <h6>История изменений документа</h6>
                <History data={d.document.history} hide={d.isRemoved} />
              </Col>
            </Row>

          </Container>
        )
      }}
    </Query>
  )
}

export default Document
