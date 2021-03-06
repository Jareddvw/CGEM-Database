import React from 'react'
import { Modal } from 'react-bootstrap'

const UnauthModal = ({ show, onHide }) => {
  return (
    <Modal show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={onHide} >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Sign in to modify this reaction!
            </Modal.Title>
        </Modal.Header>
      <Modal.Body style={{overflowWrap:'break-word'}}>
        You must be authenticated to make changes to reactions. Please log in or create an account to continue.
      </Modal.Body>
      <Modal.Footer>
        <button className='btn btn-outline-primary' onClick={onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  )
}

export default UnauthModal