import { Form, Button } from 'react-bootstrap'
import { Container, Col } from 'react-bootstrap'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import ru from 'date-fns/locale/ru';
import { Formik, Form as FormikForm, useField } from 'formik'
import yup from '../utils/yup'
import hints from '../conf/hints'

registerLocale('ru', ru)
setDefaultLocale('ru')

//
// Document data type for JSON encoding
// https://nauchniestati.ru/blog/seriya-i-nomer-diploma/
//
// interface DocumentData {
//   institution: string;
//   series: string;
//   number: string;
//   issue_number: number;
//   issue_date: date;
//   first_name: string;
//   middle_name: string;
//   last_name: string;
//   specialty: string;
//   qualification: string;
//   degree: string;
//   honours: boolean;
//   protocol_number: number;
//   protocol_date: date;
//   chairman: string;
//   head: string;
// }

const validationSchema = yup.object().shape({
  institution: yup.string().req(),
  series: yup.string().series().req(),
  number: yup.string().number().req(),
  issue_number: yup.string().reg_number().req(),
  issue_date: yup.date().typeError().req(),
  first_name: yup.string().req(),
  middle_name: yup.string(),
  last_name: yup.string().req(),
  specialty: yup.string().specialty().req(),
  qualification: yup.string().req(),
  degree: yup.string().req(),
  honours: yup.boolean().typeError(),
  protocol_number: yup.string().reg_number().req(),
  protocol_date: yup.date().typeError().req(),
  chairman: yup.string().req(),
  head: yup.string().req(),
})

const defaultValues = {
  institution: '',
  series: '',
  number: '',
  issue_number: '',
  issue_date: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  specialty: '',
  qualification: '',
  degree: '',
  honours: false,
  protocol_number: '',
  protocol_date: '',
  chairman: '',
  head: '',
}

const DocumentForm = props => {

  // Text input component
  const Input = props => {
    const [field, meta] = useField(props)
    return (
      <>
        <Form.Group controlId={props.id || props.name} as={Col} {...props}>
          <Form.Label>{props.label}</Form.Label>
          <Form.Control
            size='sm'
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

  // Single checkbox component
  const Checkbox = props => {
    const [field, meta, helpers] = useField(props)
    const { value } = meta;
    const { setValue } = helpers;
    return (
      <>
        <Form.Group controlId={props.id || props.name} as={Col} {...props}>
          <Form.Label>{props.label}</Form.Label>
          <Form.Check
            type='checkbox'
            name='honours'
            checked={value}
            onChange={() => setValue(!value)}
          />
        </Form.Group>
      </>
    )
  }

  // Date picker component
  // FIXME: validation error string is not shown (styles inheritance)
  const DateInput = props => {
    const [field, meta, helpers] = useField(props)
    const { value } = meta;
    const { setValue } = helpers;
    return (
      <>
        <Form.Group controlId={props.id || props.name} as={Col} xs={4} md={2}>
          <div>
            <Form.Label>{props.label}</Form.Label>
          </div>
          <div>
            <Form.Control
              size='sm'
              type='text'
              isValid={meta.touched && !meta.error}
              isInvalid={meta.touched && !!meta.error}
              as={DatePicker}
              dateFormat='dd/MM/yyyy'
              placeholderText='чч/мм/гггг'
              todayButton="Сегодня"
              selected={value}
              onChange={setValue}
              {...props}
            />
          </div>
          <Form.Control.Feedback type='invalid'>
            {meta.error}
          </Form.Control.Feedback>
        </Form.Group>
      </>
    )
  }

  // Select component
  const SelectInput = props => {
    const [field, meta] = useField(props)
    return (
      <>
        <Form.Group controlId={props.id || props.name} as={Col} {...props}>
          <Form.Label>{props.label}</Form.Label>
          <Form.Control
            size='sm'
            type={props.type || 'text'}
            as='select'
            custom
            isValid={meta.touched && !meta.error}
            isInvalid={meta.touched && !!meta.error}
            {...field}
            {...props}
          >
            {props.children}
          </Form.Control>
          <Form.Control.Feedback type='invalid'>
            {meta.error}
          </Form.Control.Feedback>
        </Form.Group>
      </>
    )
  }

  // Select options list generator
  // Builds list as follows:
  //  - if there is no initial value, provide a placeholder on top
  //  - if there is a initial value which missing in hints, add it on top
  //  - otherwise list all hints, the initial value will be automatically selected
  const listOptions = (name, values, initialValues) => {
    const list = hints[name]
    const value = values[name]
    const initialValue = initialValues[name]

    let options = []

    if (!initialValue) {
      if (!value)
        options.push(<option key={-1} value='' disabled>Выберите ...</option>)
    } else {
      let found = false
      for (let i in list) {
        if (list[i] == initialValue) {
          found = true
          break
        }
      }
      if (!found)
        options.push(<option key={-1}>{initialValue}</option>)
    }

    for (let i in list)
      options.push(<option key={i}>{list[i]}</option>)

    return options
  }

  // Form submit handler calling provide callback with new values
  const submitHandler = (values, { setSubmitting }) => {
    setSubmitting(false)
    props.onSubmit({id: props.id, values, index: props.index})
  }

  // The form
  return (
    <Formik
      initialValues={{ ...defaultValues, ...props.values}}
      validationSchema={validationSchema}
      onSubmit={submitHandler}
    >
      { ({ isSubmitting, values, initialValues }) => (
        <FormikForm noValidate>
          <h4 className='mt-2'>{props.mode == 'add' && 'Добавление записи' || 'Редактирование записи'}</h4>
          <fieldset disabled={isSubmitting}>

            <Form.Row className='mt-2'>
              <SelectInput name='institution' label='Учебное заведение'>
                {listOptions('institution', values, initialValues)}
              </SelectInput>
            </Form.Row>

            <Form.Row>
              <Input name='series' label='Серия' placeholder='000000' readOnly={props.mode == 'update'} />
              <Input name='number' label='Номер' placeholder='0000000' readOnly={props.mode == 'update'} />
              <Input name='issue_number' label='Рег.№' placeholder='000' xs={2} />
              <DateInput name='issue_date' label='Выдан' />
            </Form.Row>

            <Form.Row>
              <Input name='last_name' label='Фамилия' placeholder='' />
              <Input name='first_name' label='Имя' placeholder='' />
              <Input name='middle_name' label='Отчество' placeholder='' />
            </Form.Row>

            <Form.Row>
              <SelectInput name='specialty' label='Специальность'>
                {listOptions('specialty', values, initialValues)}
              </SelectInput>
            </Form.Row>

            <Form.Row>
              <SelectInput name='qualification' label='Квалификация'>
                {listOptions('qualification', values, initialValues)}
              </SelectInput>
              <SelectInput name='degree' label='Степень'>
                {listOptions('degree', values, initialValues)}
              </SelectInput>
              <Checkbox name='honours' label='С отличием' xs={3} md={2} />
            </Form.Row>

            <Form.Row>
              <Input name='protocol_number' label='Протокол' placeholder='000' xs={3} md={2} />
              <DateInput name='protocol_date' label='от' />
            </Form.Row>

            <Form.Row>
              <Input name='chairman' label='Председатель комиссии' placeholder='' />
              <Input name='head' label='Глава учебного заведения' placeholder='' />
            </Form.Row>

            <Form.Row>
              <div className='ml-auto mb-3'>
                {props.mode == 'add' &&
                  <Button variant='primary' className='ml-2' size='sm' type='submit'>{'Создать'}</Button>
                }
                {props.mode == 'update' &&
                  <Button variant='success' className='ml-2' size='sm' type='submit'>{'Сохранить'}</Button>
                }
                {/*<Button variant='outline-danger' className='ml-2' size='sm' type='reset'>{'Сбросить'}</Button>*/}
                <Button variant='secondary' className='ml-2' size='sm' onClick={props.onHide}>{'Отменить'}</Button>
              </div>
            </Form.Row>

          </fieldset>
        </FormikForm>
      )}
    </Formik>
  )
}

const Index = props => (
  <Container fluid className='my-3 mp-3 shadow rounded'>
    <DocumentForm className='my-3 mp-3' {...props} />
  </Container>
)

export default Index
