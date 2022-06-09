import React from 'react'
import { Container, Row } from 'react-bootstrap'

const AboutPage = () => {
  return (
    <>
        <Container>
            <Row as="h4" className='mt-4 mb-3'>About the C-GEM ribosomal reactions database</Row>
            <Row className='mt-3'> <p style={{padding:0}}> See the code on GitHub at {<span 
                className="hoverable" 
                style={{textDecoration: 'none', color: 'maroon'}}
                onClick={() => window.open( "https://github.com/Jareddvw/CGEM-DB" )}>
                    {"https://github.com/Jareddvw/CGEM-DB"}.
                </span>}
                </p>
            </Row>
        </Container>
    </>
  )
}

export default AboutPage