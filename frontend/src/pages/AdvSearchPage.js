import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import ReactionList from '../components/ReactionList'
import StructureList from '../components/StructureList'

const AdvSearchPage = () => {

  let [queries, setQueries] = useState({})
  let [ordering, setOrdering] = useState("?ordering=id")
  let [reactions, setReactions] = useState([])


  let getReactions = async () => {
    let response = await fetch('/api/' + ordering)
    let data = await response.json()
    setReactions(data.results)
  }

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
                        onChange={(e)=>setOrdering("?ordering=" + e.target.value)} 
                        onSubmit={(e)=>setOrdering("?ordering=" + e.target.value)} className="form-select">
                        <option value="id">Database ID (default)</option>
                        <option value="internal_percent">Internal incorporation %</option>
                        <option value="n_term_percent">N-terminal incorporation %</option>
                        <option value="assay__acylation_yield">Microhelix assay yield</option>
                    </select>
                </div>
            </Row>
            <Row> 
            <Row className='mt-3'> Parent synthetase (if synthetase) 
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setOrdering(ordering + "&synthetase__parent_synthetase=" + e.target.value)} 
                        onSubmit={(e)=>setOrdering(ordering + "&synthetase__parent_synthetase=" + e.target.value)} 
                        type="text" placeholder="Synthetase" >
                    </Form.Control>
                </div>
            </Row>

            </Row>

            <Button className="mb-3" onClick={getReactions}> Submit </Button>
        </Container>
        {(reactions.length != 0) ? <StructureList reactions={reactions} /> : <></>}
    </>
  )
}

export default AdvSearchPage