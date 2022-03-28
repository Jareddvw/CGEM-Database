import React from 'react'
import { useState, useEffect } from 'react'
import ReactionList from '../components/ReactionList'
import { Container, Row, Col, Form } from 'react-bootstrap'
import StructureList from '../components/StructureList'

// Page for list of all reactions in database (different from search results page)

const ReactionListPage = () => {

    let [reactions, setReactions] = useState([])
    let [ordering, setOrdering] = useState('')
    let [cardView, setCardView] = useState("false")

    useEffect(() => {
        getReactions()
    }, [ordering, cardView])

    let getReactions = async () => {
        let response = await fetch('/api/?ordering=' + ordering)
        let data = await response.json()
        setReactions(data.results)
    }

  return (
    <>
        <Container className='mb-5'>
            <h4 className='mt-3 mb-3'> Reactions Table </h4>
            <Row className='mt-3'> This is a table containing all reactions in the database. </Row>
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
                <Col offset>
                    <div>
                        <select style={{width:300}}
                            onChange={(e)=>setCardView(e.target.value)} 
                            onSubmit={(e)=>setCardView(e.target.value)} className="form-select">
                            <option value="false">List View</option>
                            <option value="true">Card View</option>
                        </select>
                    </div>
                </Col>
            </Row>
        </Container>
        {cardView === "true" ? <StructureList reactions={reactions} /> : <ReactionList reactions={reactions} />}
    </>
  );
}

export default ReactionListPage