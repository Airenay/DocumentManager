import { Container, Row, Col } from 'react-bootstrap'
import Layout from '../../components/Layout'

const Index = () => (
  <Layout title="Главная">
    <Container fluid>
      <Row>
        <Col >
          <h2>Главная страница администрирования</h2>
          Выберите требуемое действие в главном меню.
        </Col>
      </Row>
    </Container>
  </Layout>
)

export default Index
