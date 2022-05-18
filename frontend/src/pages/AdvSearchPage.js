import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import ReactionList from '../components/list_components/ReactionList'
import StructureList from '../components/list_components/StructureList'

const AdvSearchPage = () => {

  let [queries, setQueries] = useState("")
  let [ordering, setOrdering] = useState("?ordering=id")
  let [reactions, setReactions] = useState([])


  let getReactions = async () => {
    let response = await fetch('/api/' + ordering + queries)
    let data = await response.json()
    setReactions(data.results)
    let length = await data.results?.length
    if (length === 0) {
        setReactions("blank")
    }
  }

  return (
    <>
        <Container>
            <Row as="h4" className='mt-4 mb-3'>Advanced Reaction Search</Row>
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
                        <option value="-assay__acylation_yield">Microhelix assay yield</option>
                    </select>
                </div>
            </Row>
            <Row> 
            <Row className='mt-3'> Parent synthetase (if synthetase) 
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries(queries + "&synthetase__parent_synthetase__parent_name=" + e.target.value)} 
                        onSubmit={(e)=>setQueries(queries + "&synthetase__parent_synthetase__parent_name=" + e.target.value)} 
                        type="text" placeholder="Synthetase" >
                    </Form.Control>
                </div>
            </Row>
            <Row className='mt-3'> Flexizyme name (if flexizyme) 
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries(queries + "&flexizyme__flex_name=" + e.target.value)} 
                        onSubmit={(e)=>setQueries(queries + "&flexizyme__flex_name=" + e.target.value)} 
                        type="text" placeholder="Flexizyme" >
                    </Form.Control>
                </div>
            </Row>
            <Row className='mt-3'> Monomer name
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries(queries + "&monomer__monomer_name=" + e.target.value)} 
                        onSubmit={(e)=>setQueries(queries + "&monomer__monomer_name=" + e.target.value)} 
                        type="text" placeholder="Monomer" >
                    </Form.Control>
                </div>
            </Row>
            

            </Row>
            <Row>
                <button className="btn btn-outline-primary mb-3 mt-3" onClick={getReactions}> Search </button>
            </Row>
        </Container>
        {(reactions.length !== 0) ? 
            ((reactions === "blank") ? 
                <h6 className="text-center">No reactions with those parameters found.</h6> : 
                <Container><Row className="mt-3">{<ReactionList reactions={reactions} />}</Row></Container>
                ) : 
            <></>}
    </>
  )
}

export default AdvSearchPage