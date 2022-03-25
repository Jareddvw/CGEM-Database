import { Container, Nav, Row, Col, Form, Stack, Button } from 'react-bootstrap'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
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
            <h1>{searchTerm}</h1>
            <Row className = 'mt-5 mb-3'><h4 style={{textDecoration: 'none' }} className='text-center'>Find a Reaction</h4></Row>
            <Row></Row>
            <Row className='align-items-center'>
                <Form className = 'mt-2'>
                        <Form.Control size="lg" type="text" placeholder="Search by Monomer, Flexizyme, Synthetase..." 
                            onChange={event => {setSearchTerm(event.target.value)}} onSubmit={(e) => e.preventDefault()} 
                            onKeyPress={handleEnterKeyPressed} />  
                </Form>
            </Row>   
        </Container>
      </>
  )
}

export default SearchPage