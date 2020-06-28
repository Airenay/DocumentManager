import { Container, Col, Form, Button } from 'react-bootstrap'
import { Formik, Form as FormikForm, useField } from 'formik'
import { useStorage } from '../../hooks/useStorage'
import yup from '../../utils/yup'
import Layout from '../../components/Layout'

/* Demo keys

-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.1
Comment: https://openpgpjs.org

xjMEXs/tNBYJKwYBBAHaRw8BAQdAqAQra+iT9IEKEY67tf+Uz6i8RCNsavQX
Bxqw1IwMO+jNGlRlc3QgUHJvamVjdCA8dHBAZGV2Lm51bGw+wngEEBYKACAF
Al7P7TQGCwkHCAMCBBUICgIEFgIBAAIZAQIbAwIeAQAKCRD1eZ23LJLsMZmY
AP9SuHrCEqpSZ/UdwWWcIk49TghWoNnhEtEBhRXGYrxLgQEAm5G0eBhljytL
9xZvObSTChahVn85TcYooPfqivY9kwjOOARez+00EgorBgEEAZdVAQUBAQdA
CUZmnQ1S+U0ZEGgAth2rJz9HkfCM9l9m0se/PXGrMAYDAQgHwmEEGBYIAAkF
Al7P7TQCGwwACgkQ9XmdtyyS7DH1cgEA++oZIWzX30CVQX0FqvdEMjEIOYOy
LGV83msCOmhYFTYA/RoMm/oSrQGfhCHl5K4qtXMBRsSy1yPEMsTJ09oTztgM
=0jbE
-----END PGP PUBLIC KEY BLOCK-----

-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v4.10.1
Comment: https://openpgpjs.org

xVgEXtAIhxYJKwYBBAHaRw8BAQdASNkJZQbOvg3VbD9SZ13GuxSpH19RUBHh
kPWq7uXaPxgAAQDaCELiAAm93ydOQyiYLT1G4HsHrqI6093Z/HpnImCO1Q8L
zUfQlNC40L/Qu9C+0LzQvdGL0Lkg0YDQsNCx0L7RgtCwIDxkaXBsb21hLW9w
ZW5wZ3Atc2lnbmluZ0Bvcy1wcm9wby5pbmZvPsJ4BBAWCgAgBQJe0AiHBgsJ
BwgDAgQVCAoCBBYCAQACGQECGwMCHgEACgkQYpXvXC0723v1pQD/eRZN6WgZ
9dUeKFb6A/NbfdkkzOCbaseb4PknIOcSRQQA/13bdKc9P0uLv/qmxxdOZO7E
z+QRigUAb9v5BHkDonICx10EXtAIhxIKKwYBBAGXVQEFAQEHQD65nUPBYhb+
03RB1qj6tUoKzwvzgi4aiGIOxjyp2thBAwEIBwAA/0csTbvgA9Qv1hfxeWYE
CYTWN9KLfrCyuOvoomQF/hW4EVnCYQQYFggACQUCXtAIhwIbDAAKCRBile9c
LTvbe/yRAQCaoO1JAIdo/bOiTA8PLcv8DeOwJ+99Te7/DYm3M5C3YwEAoQv3
g5gOg0LK61dO95PY+tpx1EewS2DAjJ30ART8rAs=
=JURD
-----END PGP PRIVATE KEY BLOCK-----

*/

const placeholder_publicKeyArmored = `\
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.1
Comment: https://openpgpjs.org

-----END PGP PUBLIC KEY BLOCK-----
`;

const placeholder_privateKeyArmored = `\
-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v4.10.1
Comment: https://openpgpjs.org

-----END PGP PRIVATE KEY BLOCK-----
`;

const Index = () => {
  const { storage, setPGPKeys } = useStorage()

  const submitHandler = (values, { setSubmitting }) => {
    setSubmitting(false)
    const pubKey = values.pubKey
    const privKey = values.privKey
    setPGPKeys({ pubKey, privKey })
  }

  // Text input component
  const Input = props => {
    const [field, meta] = useField(props)
    return (
      <>
        <Form.Group controlId={props.id || props.name} as={Col} {...props}>
          <Form.Label>{props.label}</Form.Label>
          <Form.Control
            as='textarea'
            isValid={meta.touched && !meta.error}
            isInvalid={meta.touched && !!meta.error}
            {...field}
            {...props}
          />
          <Form.Control.Feedback type='invalid'>
            {meta.error}
          </Form.Control.Feedback>
        </Form.Group>
        <style jsx global>{`
          textarea {
            white-space: pre;
            overflow-wrap: normal;
            overflow-x: scroll;
            color: red;
          }
        `}</style>
      </>
    )
  }

  return (
    <Layout title='Ключи для подписи'>
      <Container fluid>

        <h2>Ключи для цифровой подписи</h2>

        <Formik
          initialValues={{
            pubKey: storage?.pgpKeys?.pubKey || '',
            privKey: storage?.pgpKeys?.privKey || '',
          }}
          validationSchema={yup.object().shape({
            pubKey: yup.string().req(),
            privKey: yup.string().req(),
          })}
          onSubmit={submitHandler}
        >
          { ({ isSubmitting, setSubmitting }) => (
            <FormikForm noValidate>
              <fieldset disabled={isSubmitting}>
                <Form.Row>
                  <Input name='pubKey' label='Публичный ключ' cols={64} rows={15} wrap='soft' placeholder={placeholder_publicKeyArmored} />
                  <Input name='privKey' label='Приватный ключ' cols={64} rows={15} wrap='soft' placeholder={placeholder_privateKeyArmored} />
                </Form.Row>
                <Form.Row>
                  <Button variant='primary' type='submit'>{'Сохранить'}</Button>
                </Form.Row>
              </fieldset>
            </FormikForm>
          )}
        </Formik>

      </Container>
    </Layout>
  )
}

export default Index
