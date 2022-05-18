import React from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const ReferenceItem = ({ reference, number }) => {
  return (
    <>  
        <Container>
            {number}. {<a href={reference.DOI} 
                          target="_blank"
                          style={{textDecoration: 'none', color: 'maroon'}}>
                            {reference.DOI}
                        </a>}. 
        </Container>
    </>
  )
}

export default ReferenceItem