import { Container, Row, Form } from 'react-bootstrap'
import { useState } from 'react'
import { createBrowserHistory } from 'history'
import MonomerDrawing from '../components/MonomerDrawing'

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
            <MonomerDrawing smiles={searchTerm} width='600' height='600'></MonomerDrawing>
        </Container>
      </>
  )
}

export default SearchPage