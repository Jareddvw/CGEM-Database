import React from 'react'
import StructureListItem from './StructureListItem'
import { Container, Row, Col } from 'react-bootstrap'

const StructureList = ({ reactions }) => {
  return (
    <>
        <Container>
            <Row className="g-0" lg={3} md={2} sm={1}>
                {reactions.map((reaction) => 
                    <Col key={reaction.id}><StructureListItem id = {reaction?.id} name = {reaction.monomer}
                        smiles={reaction?.monomer_smiles} width="350" height="250" /></Col>
                )}
            </Row>
        </Container>
    </>
  )
}

export default StructureList