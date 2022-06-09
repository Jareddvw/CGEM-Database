import React from 'react'

const MicrohelixAssay = ({ reaction }) => {
    if (reaction.assay == null) {
        return (<></>)
    } else {
        return (
            <>
            <div>
                <p>
                    <span style={{fontWeight: 'bold'}}>Microhelix Assay yield: </span> 
                    {reaction.assay?.acylation_yield}
                </p>
                
            </div>
            <div>
                <p><span style={{fontWeight: 'bold'}}>Conditions: </span> {reaction.assay?.conditions}</p>
            </div>
            <div>
                <p>
                    <span style={{fontWeight: 'bold'}}>Assay notes: </span> 
                    {reaction.assay?.assay_notes}
                </p>
            </div>
            </>
        )
    }
}

export default MicrohelixAssay