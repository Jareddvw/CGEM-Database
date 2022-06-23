import { useContext } from 'react'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap'
import AuthContext from '../context/AuthContext';
import cgem_logo from '../img/cgem_logo.png';

const Header = () => {


  let { user, logoutUser } = useContext(AuthContext)
    
  return (
    <>
    <Navbar className="nav header" variant="light" expand="lg" fixed="top">
        <Container>
            <Navbar.Brand href="/">
              <img
                alt=""
                height="50"
                width="auto"
                src={cgem_logo}
                className="d-inline-block align-top headerImage"
              />{' '}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
            <Nav className="justify-content-end">
                <Nav.Link href="/about">About</Nav.Link>
                <NavDropdown title="Actions" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/all-reactions">Browse All Reactions</NavDropdown.Item>
                    <NavDropdown.Item href="/draw-structures">Substructure Search</NavDropdown.Item>
                    <NavDropdown.Item href="/advanced">Advanced Search</NavDropdown.Item>
                    {/* <NavDropdown.Item href="/smiles-structures">Substructure SMILES</NavDropdown.Item> */}

                    <NavDropdown.Item href="/reaction-drafts">Reaction drafts</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/contribute">Contribute</NavDropdown.Item>
                </NavDropdown>
                { (user === null) ?
                  <Nav.Link href="/sign-in">Sign in</Nav.Link> :
                  <NavDropdown title="Account" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/my-account">Your account</NavDropdown.Item>
                    <NavDropdown.Item href="/my-reactions">Your reactions</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => logoutUser()}> Sign out</NavDropdown.Item>
                  </NavDropdown>
                }
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