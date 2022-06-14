import React from 'react'
import StructureListItem from './StructureListItem'
import { Container, Row, Col } from 'react-bootstrap'

const StructureList = ({ reactions, nolink, verbose }) => {

  return (
    <>
        <>
            <Row className="g-0 structure-list" lg={3} md={2} sm={1}>
                {reactions.map((reaction, index) => 
                    <Col key={reaction.id || index}>

                      {(verbose === true) ? 
                          <StructureListItem id = {reaction?.id} 
                          name = {reaction.monomer.monomer_name || reaction.monomer.monomer_smiles} 
                          flexizyme = {reaction.flexizyme?.flex_name} 
                          synthetase = {reaction.synthetase?.synth_common_name} 
                          acylation_yield={reaction.assay?.acylation_yield} 
                          smiles={reaction.monomer?.monomer_smiles} 
                          width="350" height="250" nolink={nolink} /> : 
                          
                          <StructureListItem id = {reaction?.id} 
                          name = {reaction.monomer} 
                          flexizyme = {reaction.flexizyme} 
                          synthetase = {reaction.synthetase} 
                          acylation_yield={reaction.acylation_yield} 
                          smiles={reaction.monomer_smiles} 
                          width="350" height="250" nolink={nolink} /> 
                        }
                        
                    </Col>
                )}
            </Row>
        </>
    </>
  )
}

export default StructureList