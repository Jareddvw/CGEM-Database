import { Container, Row, Form, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { createBrowserHistory } from 'history'

const SearchPage = () => {
    
    let history = createBrowserHistory()
    const [searchTerm, setSearchTerm] = useState('')

    const handleEnterKeyPressed = (e) => {
        if (e.key === "Enter") {
            if (searchTerm) {
                history.push(`/search/${searchTerm.replaceAll(' ', '+')}`)
                window.location.reload();
            }
        }
    }

  return (
      <>
        <Container>
            <Row className = 'mt-5 mb-3'>
                <h5 style={{textDecoration: 'none', marginTop: '10vw'}} className='text-center'>
                    Find a Reaction
                </h5>
            </Row>
            <Row className='align-items-center mx-auto' style={{width:'65vw'}}>
                <Form className = 'mt-2'>
                        <Form.Control size="lg" type="text" placeholder="Search by Monomer, Flexizyme, Synthetase, tRNA, SMILES..." 
                            onChange={event => {setSearchTerm(event.target.value)}} onSubmit={(e) => e.preventDefault()} 
                            onKeyPress={handleEnterKeyPressed} />  
                </Form>
            </Row>
            <Row className = "mx-auto" lg={3} style={{width: '50vw', marginTop:'10vw'}}> 
                <Col> <Link to="/advanced" className="gray-link"> Advanced Search </Link> </Col>
                <Col> <Link to="/draw-structures" className="gray-link"> Substructure Search </Link> </Col>
                <Col> <Link to="/all-reactions" className="gray-link"> Browse All Reactions </Link> </Col>
            </Row>
        </Container>
      </>
  )
}

export default SearchPage