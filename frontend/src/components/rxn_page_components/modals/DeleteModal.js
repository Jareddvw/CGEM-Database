import React from 'react'
import { Modal } from 'react-bootstrap'
import { createBrowserHistory } from 'history'

const DeleteModal = ({ show, reactionId, onHide, authTokens }) => {

    const history = createBrowserHistory()

    const handleDelete = async () => {
        let response = await fetch(`/api/single/${reactionId}`, {
                method: 'delete',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + String(authTokens.access)
                },
            })
            .catch((error) => {
                console.error(error);
            })

        if (response.ok) {
            alert("success!"); 
            history.push("/all-reactions")
            window.location.reload()
        }
    }

    return (
        <Modal show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={onHide} >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete this reaction
                </Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <h5>Are you sure you want to delete this entry from the database?</h5>
            <p>
              This reaction and its associated assays will be deleted.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-outline-secondary' 
                    onClick={onHide}>
                Cancel
            </button>
            <button className='btn btn-outline-danger' 
                    onClick={handleDelete}>
                Yes, delete
            </button>
          </Modal.Footer>
    </Modal>
    )
}

export default DeleteModal