import React from 'react'

const MicrohelixAssay = ({ reaction }) => {
    if (reaction.assay == null) {
        return (<></>)
    } else {
        return (
            <>
            <div>
                Microhelix Assay yield: {reaction.assay.acylation_yield}
            </div>
            <div>
                Conditions: {reaction.assay.conditions}
            </div>
            <div>
                Assay notes: {reaction.assay.assay_notes}
            </div>
            </>
        )
    }
}

export default MicrohelixAssay