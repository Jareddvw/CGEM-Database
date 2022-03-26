import React from 'react'
import { useState, useEffect } from 'react'
import ReactionList from '../components/ReactionList'
import { Container, Row, Col, Form } from 'react-bootstrap'

// Page for list of all reactions in database (different from search results page)

const ReactionListPage = () => {

    let [reactions, setReactions] = useState([])
    let [ordering, setOrdering] = useState('')
    let [url, setUrl] = useState('')

    useEffect(() => {
        getReactions()
    }, [])

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
            <Row className='mt-3'>Order results by: 
                <Col><div style={{width:300}}>
                    <Form.Control as="select" onChange={(e)=>setOrdering(e.target.value)} onSubmit={(e)=>setOrdering(e.target.value)}>
                        <option value="id">Database ID</option>
                        <option value="internal_percent">Internal incorporation %</option>
                    </Form.Control>
                </div></Col>
            </Row>
        </Container>
        <ReactionList reactions={reactions} />
    </>
  );
}

export default ReactionListPage