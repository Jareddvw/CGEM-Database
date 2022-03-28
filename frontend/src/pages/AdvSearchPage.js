import { Container, Row, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'

const AdvSearchPage = () => {

  let [query, setQuery] = useState({})
  let [ordering, setOrdering] = useState("")


  return (
    <>
        <Container>
            <h4 className='mt-3 mb-3'>Advanced Reaction Search</h4>
            <Row className='mt-3'> This will return all reactions that meet the selected criteria 
            (every additional filter will be joined with an AND statement). 
            Empty fields will be ignored so you don’t have to fill in every box (default ordering is by Database ID). </Row>
            <Row></Row>
            <Row className='mt-3'> Order results by: 
                <div style={{width:300}}>
                    <select 
                        onChange={(e)=>setOrdering(e.target.value)} 
                        onSubmit={(e)=>setOrdering(e.target.value)} className="form-select">
                        <option value="id">Database ID (default)</option>
                        <option value="internal_percent">Internal incorporation %</option>
                        <option value="n_term_percent">N-terminal incorporation %</option>
                        <option value="assay__acylation_yield">Microhelix assay yield</option>
                    </select>
                </div>
            </Row>
            <Button> Submit </Button>
        </Container>
    </>
  )
}

export default AdvSearchPage