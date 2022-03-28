import React from 'react'
import { useState, useEffect } from 'react'
import StructureListItem from '../components/StructureListItem'
import MonomerDrawing from '../components/MonomerDrawing'
import SmilesDrawer from 'smiles-drawer'
import { Container, Row, Col, CardGroup, Card } from 'react-bootstrap'
import StructureList from '../components/StructureList'


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
                    <StructureList reactions={reactions} />
                </Container>
            </>
        )
    }
}

export default StructureListPage