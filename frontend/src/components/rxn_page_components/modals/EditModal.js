import React, { useState } from 'react'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'

const EditModal = ( { show, onHide, reactionId, authTokens, initialReactionData } ) => {

    let [reactionData, setReactionData] = useState(initialReactionData)


  const formContents = () => {
    return (
      <Form>
        <Form.Control defaultValue={initialReactionData.flexizyme?.flex_name}></Form.Control>
        <InputGroup>
          <InputGroup.Text id="basic-addon1">flexizyme: </InputGroup.Text>
          <Form.Control
            placeholder={initialReactionData.flexizyme?.flex_name}
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
      </Form>
    )
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
        {JSON.stringify(initialReactionData)}
      </Modal.Body>
      <Modal.Footer>
        <button className='btn btn-outline-danger' onClick={onHide}>Cancel</button>
        <button className='btn btn-outline-primary' onClick={onHide}>Save and Submit</button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditModal