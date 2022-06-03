import React from 'react'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import ReactionOrStructureList from '../components/list_components/ReactionOrStructureList'

// Page for list of all reactions in database (different from search results page)

const ReactionListPage = () => {

    let [reactions, setReactions] = useState([])
    let [ordering, setOrdering] = useState('')
    let [cardView, setCardView] = useState("false")

    useEffect(() => {
        getReactions()
    }, [ordering])

    useEffect(() => {
    }, [cardView])

    let getReactions = async () => {
        let response = await fetch('/api/?ordering=' + ordering)
        let data = await response.json()
        setReactions(data.results)
    }

  return (
    <>
        <Container className='mb-4 mt-4'>
            <Row as="h4" className='mt-3 mb-3'> Reactions Table </Row>
            <Row className='mt-3'> This is a table containing all reactions in the database. </Row>
            <Row className='mt-3 align-items-center'> Order results by: 
                <div style={{width:300}}>
                    <select 
                        onChange={(e)=>setOrdering(e.target.value)} 
                        onSubmit={(e)=>setOrdering(e.target.value)} className="form-select">
                        <option value="id">Database ID (default)</option>
                        <option value="-internal_percent&internal_incorporation=Y">Internal incorporation %</option>
                        <option value="-n_term_percent&n_term_incorporation=Y">N-terminal incorporation %</option>
                        <option value="-assay__acylation_yield&synthetase__isnull=true">Microhelix assay acylation yield</option>
                    </select>
                </div>
                <Col>
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
            <Row className='mt-4'>
                <ReactionOrStructureList 
                    reactions={reactions} 
                    cardView={cardView} 
                    verbose={false} />
            </Row>
        </Container>
        
    </>
  );
}

export default ReactionListPage