import { Modal, Image } from 'react-bootstrap'

const About = props => (
  <Modal backdrop {...props} onClick={props.onHide}>
    <Modal.Body>
      <h2>
        <span className="text-danger">D</span>igital
        <span className="text-danger"> D</span>iploma
        <span className="text-danger"> M</span>anagement
        <span className="text-danger"> S</span>ystem
      </h2>
      <font style={{fontSize: '1.0rem', fontStyle: 'italic'}}>
        Система управления цифровыми дипломами на базе блокчейна
      </font>
      <Image src='/images/about.jpg' fluid />
    </Modal.Body>
  </Modal>
)

export default About
