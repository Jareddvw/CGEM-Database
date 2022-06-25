import React from 'react'
import StructureListItem from './StructureListItem'
import { Container, Row, Col } from 'react-bootstrap'

const StructureList = ({ reactions, nolink, verbose, drafts }) => {

  // const width = 350
  // const height = 250


  const width = 340
  const height = 200
  const cardsPerRowLG = 3
  const cardsPerRowMD = 2
  const cardsPerRowSM = 1

  return (
    <>
        <>
            <Row className="g-0 structure-list" lg={cardsPerRowLG} md={cardsPerRowMD} sm={cardsPerRowSM}>
                {reactions.map((reaction, index) => 
                    <Col key={reaction.id || index}>
                      {(verbose === true) ? 
                          <StructureListItem id = {reaction?.id} 
                          name = {reaction.monomer.monomer_name || reaction.monomer.monomer_smiles} 
                          flexizyme = {reaction.flexizyme?.flex_name} 
                          synthetase = {reaction.synthetase?.synth_common_name} 
                          acylation_yield={reaction.assay?.acylation_yield} 
                          smiles={reaction.monomer?.monomer_smiles} 
                          width={width} height={height} nolink={nolink} drafts={drafts}/> 
                          : 
                          <StructureListItem id = {reaction?.id} 
                          name = {reaction.monomer} 
                          flexizyme = {reaction.flexizyme} 
                          synthetase = {reaction.synthetase} 
                          acylation_yield={reaction.acylation_yield} 
                          smiles={reaction.monomer_smiles} 
                          width={width} height={height} nolink={nolink} drafts={drafts}/> 
                        }
                        
                    </Col>
                )}
            </Row>
        </>
    </>
  )
}

export default StructureList