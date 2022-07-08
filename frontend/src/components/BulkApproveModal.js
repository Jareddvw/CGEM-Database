import React, { useEffect } from 'react'
import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { createBrowserHistory } from 'history'

const BulkApproveModal = ({ show, reactionId, onHide, authTokens, reaction }) => {

    const history = createBrowserHistory()
    let [message, setMessage] = useState("")

    const handleSubmit = async () => {
        let response1 = await fetch(`/api/single/`, {
                method: 'post',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify(reaction)
            })
            .catch((error) => {
                console.error(error);
            })
        if (!response1.ok) {
            setMessage("Error approving drafts. You may not have the proper permissions.")
            return;
        }

        let response2 = await fetch(`/api/drafts/${reactionId}`, {
            method: 'delete',
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            },
        })
        .catch((error) => {
            console.error(error);
        })

        if (response2.ok) {
            alert("success!"); 
            history.push("/reaction-drafts")
            window.location.reload()
        } else {
            setMessage("Something went wrong with deleting this draft. However, the reaction was added successfully.")
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
                    Approve this draft
                </Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <h5>Are you sure you want to approve this reaction?</h5>
            <p>
              This reaction will be deleted from /reaction-drafts and added to /reactions.
            </p>
            {message !== "" ? <p style={{color:'maroon'}}>{message}</p> : <></>}
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-outline-danger' 
                    onClick={onHide}>
                Cancel
            </button>
            <button className='btn btn-outline-success' 
                    onClick={handleSubmit}>
                Yes, submit
            </button>
          </Modal.Footer>
    </Modal>
    )
}

export default BulkApproveModal