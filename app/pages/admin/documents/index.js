import { useMemo } from "react"
import { Container, Row } from 'react-bootstrap'
import { Query } from 'urql'
import gql from 'graphql-tag'
import config from '../../../conf/config'
import withUrqlClient from '../../../hooks/withUrqlClient'
import Layout from '../../../components/Layout'
import Table from '../../../components/Table'
import LoadingMessage from '../../../components/LoadingMessage'
import DataError from '../../../components/DataError'
import { linkToDocument, linkToView } from '../../../utils/links'
import { jsonToDate, formatAsDate } from '../../../utils/dates'

const Page = props => {
  const query = gql`
    query {
      documentObjects(orderBy: dateCreated) {
        id
        series
        number
        isRevoked
        issue_date
        first_name
        middle_name
        last_name
        degree
        honours
        qualification
      }
    }
  `
  const revoked = ({ cell: { value, row }}) => {
    if (row.original.isRevoked)
      return <del className='text-danger' title='Аннулирован'>{value}</del>
    return value
  }

  const fullName = row => {
    const name = []
    for (let f of ['last_name', 'first_name', 'middle_name'])
      if (row[f])
        name.push(row[f])
    return name.join(' ')
  }

  const degree = row => {
    if (row.cell.row.original.honours)
      return <span title='С отличием'>{row.cell.value} &#x1f4af;</span>
    return row.cell.value
  }

  const actions = row => {
    const id = row.cell.value
    return (
      <span className='d-flex justify-content-center'>
        {linkToView(id, <span title='Просмотр диплома'>&#x1f50d;</span>)}
        {' '}
        {linkToDocument(id, <span title='Работа с документом'>&#x1f4c2;</span>)}
      </span>
    )
  }

  // Table representing current document state
  const columns = useMemo(() => [
      { Header: '№ документа', accessor: row => [row.series, row.number].join(' '), Cell: revoked },
      { Header: 'Выдан', accessor: 'issue_date', Cell: row => formatAsDate(jsonToDate(row.cell.value)) },
      { Header: 'ФИО', accessor: fullName },
      { Header: 'Степень', accessor: 'degree', Cell: degree },
      { Header: 'Квалификация', accessor: 'qualification' },
      { Header: 'Действия', accessor: 'id', disableSortBy: true, Cell: actions },
    ], []
  );

  return (
    <Query query={query} requestPolicy={config.api?.requestPolicy}>
      {({ data, fetching, error }) => {
        if (fetching) return <LoadingMessage />
        if (error) return <DataError>{error.message}</DataError>

        return (
          <>
            <div className='shadow m-3 p-2 rounded w-100'>
              <h6>Список документов</h6>
              <Table
                columns={columns}
                data={data.documentObjects || []}
                globalFilter
                pageSizes={config.pageSizes}
                size={config.ui.size}
                responsive bordered hover
              />
            </div>
          </>
        )
      }}
    </Query>
  )
}

const Index = () => (
  <Layout title="Список документов">
    <Container fluid>
      <Row>
        <Page />
      </Row>
    </Container>
  </Layout>
)

export default withUrqlClient(Index)
