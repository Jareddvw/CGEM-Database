import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const EditModal = (props) => {
  return (
    <Modal show={props.show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={props.onHide} >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Edit reaction information
            </Modal.Title>
        </Modal.Header>
      <Modal.Body>
        <h5>Centered Modal</h5>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <button className='btn btn-outline-danger' onClick={props.onHide}>Cancel</button>
        <button className='btn btn-outline-primary' onClick={props.onHide}>Save</button>
      </Modal.Footer>
        
    </Modal>
  )
}

export default EditModal