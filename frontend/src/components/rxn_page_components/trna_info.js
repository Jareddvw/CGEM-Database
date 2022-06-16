import React from 'react'
import { Card } from 'react-bootstrap'

const Trna_info = ( {trna} ) => {
    if (trna == null) {
        return (<></>)
    } else {
        return (
            <>
            <Card id="trna" style={{ width: 400 }} className="mx-3 px-0">
                <Card.Header><strong>{trna.tRNA_name}</strong></Card.Header>
                <Card.Body>
                    <Card.Text>
                        {trna.tRNA_seq || "No sequence recorded."}
                    </Card.Text>
                </Card.Body>
            </Card>
            </>
        )
    }
}

export default Trna_info