import React from 'react'
import { useState, useEffect } from 'react'
import StructureListItem from '../components/StructureListItem'
import MonomerDrawing from '../components/MonomerDrawing'
import SmilesDrawer from 'smiles-drawer'
import { Container, Row, Col, CardGroup, Card } from 'react-bootstrap'


const StructureListPage = () => {

    let [reactions, setReactions] = useState([])

    useEffect(() => {
        getReactions()
    }, [])

    let getReactions = async () => {
        let response = await fetch('/api/')
        let data = await response.json()
        setReactions(data.results) 
    }

    if (reactions !== []) {
        return (
            <>
                <Container>
                    <Row className="g-0" lg={4} md={2} sm={1}>
                        {reactions.map((reaction) => 
                            <Col key={reaction.id}><StructureListItem id = {reaction?.id} name = {reaction.monomer}
                                smiles={reaction?.monomer_smiles} width="250" height="150" /></Col>
                        )}
                    </Row>
                </Container>
            </>
        )
    }
}

export default StructureListPage