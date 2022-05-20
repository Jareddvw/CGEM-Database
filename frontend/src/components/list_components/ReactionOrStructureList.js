import React from 'react'
import ReactionList from './ReactionList'
import StructureList from './StructureList'
import { useEffect } from 'react'

const ReactionOrStructureList = ( {cardView, reactions, verbose } ) => {

    useEffect(() => {
    }, [cardView])

    // verbose tells us if reactions object is returned by /api/single (when true), 
    // or just from /api/ when false. Verbose takes in a larger object that needs more manipulation.
    // Probably best to use verbose=true only for advanced search.

    return (
        <>
            {cardView === "false" ? <ReactionList reactions={reactions} verbose={verbose} /> :
                                    <StructureList reactions={reactions} verbose={verbose} />}
        </>
    )
}

export default ReactionOrStructureList