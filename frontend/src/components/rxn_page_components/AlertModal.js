import React from 'react'
import { Modal, ModalTitle } from 'react-bootstrap'

const AlertModal = ({ show, onHide, headerText, bodyText }) => {
  return (
    <Modal show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={onHide} >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {headerText}
                </Modal.Title>
            </Modal.Header>
          <Modal.Body>
            {bodyText}
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-outline-secondary' 
                    onClick={onHide}>
                Close
            </button>
          </Modal.Footer>
    </Modal>
  )
}

export default AlertModal