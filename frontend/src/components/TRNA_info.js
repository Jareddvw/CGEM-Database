import React from 'react'
import { Card } from 'react-bootstrap'

const TRNA_info = ( {tRNA} ) => {
    if (tRNA == null) {
        return (<></>)
    } else {
        return (
            <>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{tRNA.tRNA_name}</Card.Title>
                    <Card.Text>
                        {tRNA.tRNA_seq}
                    </Card.Text>
                </Card.Body>
            </Card>
            </>
        )
    }
}

export default TRNA_info