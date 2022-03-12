import React from 'react'
import { Card } from 'react-bootstrap'

const FlexOrSynthInfo = ({synthetase, flexizyme}) => {
    if (synthetase != null) {
        return (
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>Synthetase</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">common name: {synthetase.synth_common_name} </Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">parent synthetase: {synthetase.parent_synthetase || "no parent recorded"} </Card.Subtitle>
                    <Card.Text>
                        some synthetase stuff
                    </Card.Text>
                </Card.Body>
            </Card>
          )
    } else if (flexizyme != null) {
        return (
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>Flexizyme</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">name: {flexizyme.flex_name} </Card.Subtitle>
                    <Card.Text>
                        sequence: {flexizyme.flex_sequence || "No sequence recorded"}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    } else {
        return (
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Text>
                        Chemical acylation used (no flexizyme or synthetase).
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}

export default FlexOrSynthInfo