import React from 'react'
import ReactionOrStructureList from '../components/list_components/ReactionOrStructureList'
import { useState, useEffect, } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const MyReactionsPage = () => {

    let [reactions, setReactions] = useState([])
    let [ordering, setOrdering] = useState('')
    let [cardView, setCardView] = useState("false")

    let {authTokens, logoutUser, user} = useContext(AuthContext)

    useEffect(() => {
        getReactions()
    }, [ordering])

    useEffect(() => {
    }, [cardView])

    let getReactions = async () => {
        let response = await fetch('/api/myreactions',
        {
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            },
        }).catch((error) => {
            console.error(error);
            //go to some error page
        })
        let data = await response.json()

        console.log(data)
        if (response.status === 200) {
            setReactions(data)
        } else if (response.statusText === 'Unauthorized') {
            logoutUser()
        }
    }

  return (
    <>
        <Container className='mb-4 mt-5'>
            <Row className='mt-3' as="h4"> Your reactions: {user.username} </Row>
            <Row className='mt-3'> These are all of the reactions you have added. </Row>
            <Row className='mt-3'> Order results by: 
                <div style={{width:300}}>
                    <select 
                        onChange={(e)=>setOrdering(e.target.value)} 
                        onSubmit={(e)=>setOrdering(e.target.value)} className="form-select">
                        <option value="id">Database ID (default)</option>
                        <option value="internal_percent">Internal incorporation %</option>
                        <option value="n_term_percent">N-terminal incorporation %</option>
                        <option value="-assay__acylation_yield">Microhelix assay acylation yield</option>
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
            <Row className='mt-4'>{reactions === [] ? <></> : <ReactionOrStructureList reactions={reactions} cardView={cardView} /> } </Row>
        </Container>
        
    </>
  );
}

export default MyReactionsPage