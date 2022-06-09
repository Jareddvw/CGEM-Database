import React from 'react'
import { Card } from 'react-bootstrap'

const TRNA_info = ( {tRNA} ) => {
    if (tRNA == null) {
        return (<></>)
    } else {
        return (
            <>
            <Card id="trna" style={{ width: 400 }} className="mx-3">
                <Card.Header><strong>{tRNA.tRNA_name}</strong></Card.Header>
                <Card.Body>
                    <Card.Text>
                        {tRNA.tRNA_seq || "No sequence recorded."}
                    </Card.Text>
                </Card.Body>
            </Card>
            </>
        )
    }
}

export default TRNA_info