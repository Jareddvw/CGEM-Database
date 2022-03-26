import React from 'react'
import { useState, useEffect } from 'react'
import StructureListItem from '../components/StructureListItem'
import MonomerDrawing from '../components/MonomerDrawing'
import SmilesDrawer from 'smiles-drawer'
import { Card, Container, Row } from 'react-bootstrap'


const StructureList = () => {

    let [reactions, setReactions] = useState([])

    useEffect(() => {
        getReactions()
    }, [])

    let getReactions = async () => {
        let response = await fetch('/api/')
        let data = await response.json()
        setReactions(data.results) 
    }

    console.log(reactions)
    if (reactions !== []) {
        return (
            <>
                <Container>
                    <Row>
                        {reactions.map((reaction) => 
                            <Card key={reaction?.id} style={{width:'23rem'}}><MonomerDrawing smiles={reaction?.monomer_smiles} /></Card>
                        )}
                    </Row>
                </Container>
            </>
        )
    }
}

export default StructureList