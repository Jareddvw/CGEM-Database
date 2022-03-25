import React from 'react'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap'

const Header = () => {
  return (
    <>
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
            <Navbar.Brand href="/">CGEMDB</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
            <Nav className="justify-content-end">
                <Nav.Link href="#about">About</Nav.Link>
                <NavDropdown title="Actions" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/advanced">Advanced Search</NavDropdown.Item>
                    <NavDropdown.Item href="/structures">Structure Search</NavDropdown.Item>
                    <NavDropdown.Item href="/all-reactions">Browse All Reactions</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Contribute</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="#signin">Sign in</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    <br></br>
    <br></br>
    </>
  );
}

export default Header