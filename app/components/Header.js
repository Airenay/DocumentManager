import Link from 'next/link'
import { withRouter } from 'next/router'
import { useState } from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'
import classNames from 'classnames'
import Help from './Help'
import About from './About'

export const NavLink = props => {
  let className = classNames({
    "nav-link": true,
    "active": props.path == props.pathname
  })
  return (
    <Link href={props.path}>
      <a className={className}>{props.label}</a>
    </Link>
  )
}

const Header = ({ router: { pathname }, title, account }) => {
  const [ showHelp, setShowHelp ] = useState(false)
  const [ showAbout, setShowAbout ] = useState(false)
  return (
    <>
      <Navbar expand="sm" variant="dark" bg="secondary">
        <Container fluid>
          <Link href='/admin' passHref={true}>
            <Navbar.Brand>
              <img src='/images/logo.png' height='30' className='d-inline-block' />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="mr-auto">
              <NavLink path="/admin" label="Главная" pathname={pathname} />
              <NavLink path="/admin/documents" label="Просмотр" pathname={pathname} />
              <NavLink path="/admin/documents/add" label="Новый документ" pathname={pathname} />
              <NavLink path="/admin/keys" label="Ключи" pathname={pathname} />
              <a className='nav-link' href='' onClick={event => { event.preventDefault(); setShowHelp(true) }}>Справка</a>
              <a className='nav-link' href='' onClick={event => { event.preventDefault(); setShowAbout(true) }}>О системе</a>
            </Nav>
            <Nav>
              <span className='text-light'>{account ? `Аккаунт: ${account}` : null}</span>
            </Nav>
            <Nav>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Help show={showHelp} onHide={() => setShowHelp(false)} />
      <About show={showAbout} onHide={() => setShowAbout(false)} />
    </>
  )
}

export default withRouter(Header)
