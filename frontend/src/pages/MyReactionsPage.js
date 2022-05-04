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

    let {authTokens, logoutUser} = useContext(AuthContext)

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
            setReactions(reformatReactions(data))
        } else if (response.statusText === 'Unauthorized') {
            logoutUser()
        }
    }

    let reformatReactions = (reactions) => {
        let result = reactions.map((reaction) => {
            return {
                "flexizyme": ((reaction["flexizyme"] != null) ? reaction["flexizyme"]["flex_name"] : null),
                "synthetase": ((reaction["synthetase"] != null) ? reaction["synthetase"]["synth_common_name"] : null),
                "monomer": (reaction["monomer"]["monomer_smiles"] || reaction["monomer"]["monomer_name"]),
                "monomer_smiles": reaction["monomer"]["monomer_smiles"],
                "n_term_incorporation": reaction["n_term_incorporation"],
                "n_term_percent": reaction["n_term_percent"],
                "internal_incorporation": reaction["internal_incorporation"],
                "internal_percent": reaction["internal_percent"],
                "acylation_yield": reaction.assay?.acylation_yield || null
            }
        })
        return result
    }

  return (
    <>
        <Container className='mb-5'>
            <h4 className='mt-3 mb-3'> Your reactions </h4>
            <Row className='mt-3'> This is a table containing all the reactions you have added the database. </Row>
            <Row className='mt-3'> Order results by: 
                <div style={{width:300}}>
                    <select 
                        onChange={(e)=>setOrdering(e.target.value)} 
                        onSubmit={(e)=>setOrdering(e.target.value)} className="form-select">
                        <option value="id">Database ID (default)</option>
                        <option value="internal_percent">Internal incorporation %</option>
                        <option value="n_term_percent">N-terminal incorporation %</option>
                        <option value="assay__acylation_yield">Microhelix assay acylation yield</option>
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
        </Container>
        {reactions === [] ? <></> : <ReactionOrStructureList reactions={reactions} cardView={cardView} /> }
    </>
  );
}

export default MyReactionsPage