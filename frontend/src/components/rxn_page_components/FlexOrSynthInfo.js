import React from 'react'
import { Card } from 'react-bootstrap'

const FlexOrSynthInfo = ({synthetase, flexizyme, readout}) => {
    if (synthetase != null) {
        return (
            <Card id="flexsynth" style={{ width: 400 }} className="mx-2.5">
                <Card.Header> <strong>Synthetase</strong></Card.Header>
                <Card.Body>
                    <Card.Subtitle className="mb-2">Common name: {synthetase.synth_common_name} </Card.Subtitle>
                    <Card.Subtitle className="mb-2">Parent synthetase: {synthetase.parent_synthetase?.parent_name || "no parent recorded"} </Card.Subtitle>
                    <Card.Text>
                        <br />
                            <span style={{fontWeight: '600'}}>Organism(s): </span>
                             {synthetase.organisms.map((organism => organism.organism_name + "; "))}
                        <br />
                        <br />
                            <span style={{fontWeight: '600'}}>Readout: </span>
                             {readout}
                        <br />
                        <br />
                            <span style={{fontWeight: '600'}}>Mutations: </span>
                            {synthetase.mutations.map((mutation => mutation.mutation_name + "; "))}

                    </Card.Text>
                </Card.Body>
            </Card>
          )
    } else if (flexizyme != null) {
        return (
            <Card id="flexsynth" style={{ width: 400 }} className="mx-3">
                <Card.Header> <strong>Flexizyme</strong></Card.Header>
                <Card.Body>
                    <Card.Subtitle className="mb-2">name: {flexizyme.flex_name} </Card.Subtitle>
                    <Card.Text>
                        <br />
                            <span style={{fontWeight: '600'}}>Sequence: </span>
                            {flexizyme.flex_sequence || "No sequence recorded"}
                        <br />
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    } else {
        return (
            <Card id="flexsynth" style={{ width: 400 }} className="mx-3">
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