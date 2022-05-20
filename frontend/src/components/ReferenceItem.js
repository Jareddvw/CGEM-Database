import React from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const ReferenceItem = ({ reference, number }) => {

  let reformatDOI = (DOI) => {
    if (DOI.startsWith("https://doi.org/")) {
      return DOI
    } else if (DOI.startsWith("doi.org/")) {
      return "https://" + DOI
    } else { 
      return "https://doi.org/" + DOI
    }
  }

  let DOI = reformatDOI(reference.DOI)

  return (
    <>  
        <Container>
            {number}. {<span 
                          className="hoverable" 
                          onClick={() => window.open(DOI, "_blank")} 
                          style={{textDecoration: 'none', color: 'maroon'}}>
                            {DOI}
                        </span>}. 
        </Container>
    </>
  )
}

export default ReferenceItem