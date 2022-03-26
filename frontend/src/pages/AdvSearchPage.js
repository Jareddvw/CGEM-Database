import { Container, Row } from 'react-bootstrap'
import { useState, useEffect } from 'react'

const AdvSearchPage = () => {

    let [query, setQuery] = useState({})


  return (
    <>
        <Container>
            <h4 className='mt-3 mb-3'>Advanced Reaction Search</h4>
            <Row className='mt-3'> This will return all reactions that meet the selected criteria 
            (every additional filter will be joined with an AND statement). 
            Empty fields will be ignored so you don’t have to fill in every box (default ordering is by Database ID). </Row>
            <Row></Row>
        </Container>
    </>
  )
}

export default AdvSearchPage