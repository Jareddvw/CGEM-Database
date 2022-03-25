import React from 'react'
import { useState, useEffect } from 'react'
import StructureListItem from '../components/StructureListItem'
import MonomerDrawing from '../components/MonomerDrawing'
import SmilesDrawer from 'smiles-drawer'


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

    if (reactions !== []) {
        return (
            <>
                {reactions.map((reaction) => 
                    <StructureListItem key={reaction?.id} smiles = {reaction?.monomer?.monomer_smiles} /> 
                )}
            </>
        )
    }
}

export default StructureList