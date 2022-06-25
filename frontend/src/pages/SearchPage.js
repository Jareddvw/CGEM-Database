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
            <Row className="justify-content-center">
                <div className="searchBox">
                    <Row className = 'mt-5 mb-3'>
                        <h5 className='text-center'>
                            Find a Reaction
                        </h5>
                    </Row>
                    <Row className='align-items-center mx-auto' style={{width:'90%'}}>
                        <Form className = 'mt-3'>
                                <Form.Control size="md" type="text" placeholder="Search by Monomer, Flexizyme, Synthetase, tRNA, SMILES..." 
                                    onChange={event => {setSearchTerm(event.target.value)}} onSubmit={(e) => e.preventDefault()} 
                                    onKeyPress={handleEnterKeyPressed} />  
                        </Form>
                    </Row>
                    <Row className = "mb-5 justify-content-center mx-auto" lg={3} md={1} sm={1} xs={1} style={{width: '50vw', marginTop:'2vw'}}> 
                        <Col className="mt-3 mx-4" style={{width:'auto'}}> <Link to="/advanced" className="gray-link mt-3"> Advanced Search </Link> </Col>
                        <Col className="mt-3 mx-4" style={{width:'auto'}}> <Link to="/draw-structures" className="gray-link mt-3"> Substructure Search </Link> </Col>
                        <Col className="mt-3 mx-4" style={{width:'auto'}}> <Link to="/all-reactions" className="gray-link mt-3"> Browse All Reactions </Link> </Col>
                    </Row>
                </div>
            </Row>
        </Container>
      </>
  )
}

export default SearchPage