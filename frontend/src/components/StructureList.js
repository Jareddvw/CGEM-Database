import React from 'react'
import StructureListItem from './StructureListItem'
import { Container, Row, Col } from 'react-bootstrap'

const StructureList = ({ reactions, nolink }) => {

  return (
    <>
        <Container>
            <Row className="g-0" lg={3} md={2} sm={1}>
                {reactions.map((reaction) => 
                    <Col key={reaction.id}>

                      <StructureListItem id = {reaction?.id} name = {reaction.monomer} flexizyme = {reaction?.flexizyme}
                        synthetase = {reaction?.synthetase} smiles={reaction?.monomer_smiles} width="350" height="250" nolink={nolink} />
                        
                    </Col>
                )}
            </Row>
        </Container>
    </>
  )
}

export default StructureList