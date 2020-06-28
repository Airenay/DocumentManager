import Alert from 'react-bootstrap/Alert'

const Index = ({ children }) => (
  <Alert variant='danger' className='w-100'>
    {children}
  </Alert>
)

export default Index
