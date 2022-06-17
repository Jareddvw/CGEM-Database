import React, { useState } from 'react'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'

const EditModal = ( { show, onHide, reactionId, authTokens, initialReactionData } ) => {

    let [reactionData, setReactionData] = useState(initialReactionData)

  const formContents = () => {
    return (
      <Form>

        {(Object.keys(initialReactionData).map(key => {
            let obj = {}
            obj[key] = initialReactionData[key]
            return (
              <InputGroup className='m-1'>
                <InputGroup.Text id="basic-addon1"> {key} </InputGroup.Text>
                <Form.Control 
                  defaultValue={(typeof (obj[key]) === 'object') ? JSON.stringify(obj[key]) : obj[key]}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  onChange = {(e) => {setReactionData({...reactionData, [key]:e.target.value})}}
                >
                </Form.Control>
              </InputGroup>
            )
            // } else if (Array.isArray(initialReactionData[key])) { 
            //   obj[key] = "Array"
            //   return <div> {key + ': ' + obj[key]} </div>
            // } else {
            //   obj[key] = "Object"
            //   return <div> {key + ': ' + obj[key]} </div>
            
            
          }))}
          {JSON.stringify(reactionData)}
      </Form>
    )
  }

  let rxns = {"id":1,
              "user":"jaredvwilliams@gmail.com",
              "assay":null,
              "flexizyme":null,
              "synthetase":{
                  "id":1,
                  "organisms":[
                    {"id":1,
                    "organism_name":"Methanosarcina barkeri"
                  }],
                  "mutations":[
                    {"id":1,
                    "mutation_name":"C313V"
                    },
                    {"id":2,
                    "mutation_name":"Y349F"
                  }],
                  "parent_synthetase":{
                    "id":1,
                    "parent_name":"PylRS",
                    "parent_pbd_id":""},
                  "synth_common_name":"PylRS C313V; Y349F",
                  "accession_id":"",
                  "pbd_id":""},
              "monomer":{
                  "id":1,
                  "monomer_name":"",
                  "monomer_smiles":"N[C@@H](C(O)=O)CCCCNC(OCC=C)=O",
                  "monomer_LG":""
                },
              "tRNA":{
                  "id":1,
                  "tRNA_name":"Mb-tRNA-Pyl",
                  "tRNA_seq":"5’-GGGAACCUGAUCAUGUAGAAUGGACUCUAAAUCCGUUUAGCCGGGUUAGAUUCCCGGGCUUUCCGCCA-3’"
                },
              "references":[{
                "id":1,
                "DOI":"https://doi.org/10.1038/s41598-019-48357-0",
                "title":"",
                "publication_date":null,
                "journal":""
              }],
              "ribosome_name":"WT","n_term_incorporation":"",
              "n_term_percent":null,
              "internal_incorporation":"Y",
              "internal_percent":0.94,
              "rib_readout":"fluorescence",
              "rib_incorporation_notes":"mTFP1 reporter protein; TAG at position 128. Fluorescence intensity normalized against WT mTFP1. -ncAA F=2%",
              "reaction_yield":null,
              "reaction_Kcat":null,
              "reaction_Km":null,
              "date_added":"2022-06-14"
            }

  return (
    <Modal show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={onHide} >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Edit reaction information
            </Modal.Title>
        </Modal.Header>
      <Modal.Body style={{overflowWrap:'break-word'}}>

        {formContents()}


        
      </Modal.Body>
      <Modal.Footer>
        <button className='btn btn-outline-danger' onClick={onHide}>Cancel</button>
        <button className='btn btn-outline-primary' onClick={onHide}>Save and Submit</button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditModal