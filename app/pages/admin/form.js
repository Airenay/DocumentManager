import { useState } from 'react'
import { Container, Row, Button } from 'react-bootstrap'
import Layout from '../../components/Layout'
import DocumentForm from '../../components/DocumentForm'
import { unixToDate } from '../../utils/dates'

const Index = () => {
  const [ state, setState ] = useState({ show: false })

  const add = () => {
    setState(state => ({
      ...state,
      show: true,
      mode: 'add',
      submitHandler: addHandler,
      values: {},
    }))
  }

  const update = () => {
    setState(state => ({
      ...state,
      show: true,
      mode: 'update',
      submitHandler: updateHandler,
      values: {
        // institution: '',
        institution: 'Межгалактический государственный университет',

        series: '000123',
        number: '2425437',
        issue_number: '13',
        issue_date: unixToDate(315532800),
        last_name: 'Атамбаев',
        first_name: 'Курбан',
        middle_name: 'Ахмед-оглы',

        // specialty: '',
        specialty: '000 Специальность, отсутствующая в списке',

        // qualification: '',
        qualification: 'Инженер',

        // degree: '',
        degree: 'Магистр',

        honours: true,
        protocol_number: '5',
        protocol_date: new Date(),
        chairman: 'И.И.Петров',
        head: 'С.И.Иванов',
      },
    }))
  }

  const addHandler = ({values}) => {
    setState(state => ({ ...state, show: false }))
    alert('ADD: ' + JSON.stringify(values))
  }

  const updateHandler = ({values}) => {
    setState(state => ({ ...state, show: false }))
    alert('UPDATE: ' + JSON.stringify(values))
  }

  const cancelHandler = values => {
    setState(state => ({ ...state, show: false }))
  }

  return (
    <Layout title="Документ">
      <Container>
        <Row>
          {state.show &&
            <DocumentForm
              show={state.show}
              mode={state.mode}
              id={state.id}
              values={state.values}
              onSubmit={state.submitHandler}
              onHide={cancelHandler}
            />
          }
          {!state.show &&
            <div className='ml-auto'>
              <Button size='sm' variant='primary' className='mr-2' onClick={() => add()}>Добавить</Button>
              <Button size='sm' variant='success' className='mr-2' onClick={() => update()}>Редактировать</Button>
            </div>
          }
        </Row>
      </Container>
    </Layout>
  )
}

export default Index
