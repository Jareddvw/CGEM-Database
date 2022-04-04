import React from 'react'
import ReactionList from './ReactionList'
import StructureList from './StructureList'
import { useEffect } from 'react'

const ReactionOrStructureList = ( {cardView, reactions } ) => {

    useEffect(() => {
    }, [cardView])

    return (
        <>
        
            
            {cardView == "false" ? <ReactionList reactions={reactions} /> : <StructureList reactions={reactions} />}
        </>
    )
}

export default ReactionOrStructureList