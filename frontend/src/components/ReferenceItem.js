import React from 'react'
import { Container } from 'react-bootstrap'

const ReferenceItem = ({ reference, number }) => {
  return (
    <>  
        <Container>
            {number}. {reference.title}. 
            <br></br>
            DOI: {" " + reference.DOI}
        </Container>
    </>
  )
}

export default ReferenceItem