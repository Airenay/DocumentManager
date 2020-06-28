import Head from 'next/head'
import Router from 'next/router'
import { Container, Jumbotron, Form, Row, Col, Button } from 'react-bootstrap'
import { Formik, Form as FormikForm, useField } from 'formik'
import yup from '../utils/yup'

const Index = () => {

  const submitHandler = (values, { setSubmitting }) => {
    setSubmitting(false)
    const id = values.id.trim()
    Router.push(`/${id}`)
  }

  // Text input component
  const Input = props => {
    const [field, meta] = useField(props)
    return (
      <>
        <Form.Group controlId={props.id || props.name} as={Col} {...props}>
          <Form.Label>{props.label}</Form.Label>
          <Form.Control
            type={props.type || 'text'}
            isValid={meta.touched && !meta.error}
            isInvalid={meta.touched && !!meta.error}
            {...field}
            {...props}
          />
          <Form.Control.Feedback type='invalid'>
            {meta.error}
          </Form.Control.Feedback>
        </Form.Group>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Просмотр документа</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container as={Jumbotron}>
        <h2>Просмотр документа</h2>
        <Formik
          initialValues={{
            id: '',
          }}
          validationSchema={yup.object().shape({
            id: yup.string().id().req(),
          })}
          onSubmit={submitHandler}
        >
          { ({ isSubmitting, setSubmitting }) => (
            <FormikForm noValidate>
              <fieldset disabled={isSubmitting}>
                <Form.Row>
                  <Input name='id' label='Введите код' placeholder='XXXX-XXXX-XXXX-XXXX' />
                </Form.Row>
                <Form.Row>
                  <Button variant='primary' type='submit'>{'Искать'}</Button>
                </Form.Row>
              </fieldset>
            </FormikForm>
          )}
        </Formik>
      </Container>
    </>
  )
}

export default Index
