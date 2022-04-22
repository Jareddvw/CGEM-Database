import React from 'react'
import { Container } from 'react-bootstrap'

const ReferenceItem = ({ reference, number }) => {
  return (
    <>  
        <Container>
            {number}. {reference.DOI}. 
        </Container>
    </>
  )
}

export default ReferenceItem