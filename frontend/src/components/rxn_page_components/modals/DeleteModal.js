import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { createBrowserHistory } from 'history'

const DeleteModal = ({ show, reactionId, onHide, authTokens, draft }) => {

    const history = createBrowserHistory()
    let [message, setMessage] = useState("")

    const handleDelete = async () => {
        let response = await fetch(`/api/${draft===true ? "drafts" : "single"}/${reactionId}`, {
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
            history.push(`${draft===true ? "/reaction-drafts" : "/all-reactions"}`)
            window.location.reload()
        } else {
            setMessage("Error deleting draft. You may not have the proper permissions.")
        }
    }

    useEffect(() => {
        if (!show) {
            setMessage("")
        }
    }, [show])

    return (
        <Modal show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={onHide} >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete this reaction {draft ? "draft " : ""}
                </Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <h5>Are you sure you want to delete this {draft ? "draft " : "entry "}from the database?</h5>
            <p>
              This reaction {draft ? "draft " : ""}and its associated assays will be deleted.
            </p>
            {message !== "" ? <p style={{color:'maroon'}}>{message}</p> : <></>}
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