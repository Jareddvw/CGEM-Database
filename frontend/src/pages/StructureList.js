import React from 'react'
import { useState, useEffect } from 'react'
import StructureListItem from '../components/StructureListItem'
import MonomerDrawing from '../components/MonomerDrawing'
import SmilesDrawer from 'smiles-drawer'
import { Card } from 'react-bootstrap'


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
                {reactions.map((reaction) => 
                    <Card key={reaction?.id} style={{width:'22rem'}}><MonomerDrawing smiles={reaction?.monomer} /></Card>
                )}
            </>
        )
    }
}

export default StructureList