import React from 'react'
import { Card } from 'react-bootstrap'

const FlexOrSynthInfo = ({synthetase, flexizyme, readout}) => {
    if (synthetase != null) {
        return (
            <Card style={{ width: '18rem' }} className="mx-2.5">
                <Card.Header> <strong>Synthetase</strong></Card.Header>
                <Card.Body>
                    <Card.Subtitle className="mb-2">common name: {synthetase.synth_common_name} </Card.Subtitle>
                    <Card.Subtitle className="mb-2">parent synthetase: {synthetase.parent_synthetase?.parent_name || "no parent recorded"} </Card.Subtitle>
                    <Card.Text>
                        Readout: {readout}
                    </Card.Text>
                </Card.Body>
            </Card>
          )
    } else if (flexizyme != null) {
        return (
            <Card style={{ width: '18rem' }} className="mx-3">
                <Card.Header> <strong>Flexizyme</strong></Card.Header>
                <Card.Body>
                    <Card.Subtitle className="mb-2 text-muted">name: {flexizyme.flex_name} </Card.Subtitle>
                    <Card.Text>
                        sequence: {flexizyme.flex_sequence || "No sequence recorded"}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    } else {
        return (
            <Card style={{ width: '18rem' }} className="mx-3">
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