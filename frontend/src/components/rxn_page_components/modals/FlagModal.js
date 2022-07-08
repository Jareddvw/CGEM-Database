import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { createBrowserHistory } from 'history'

const FlagModal = ({ show, flagID, onHide, authTokens, isCurrentlyFlagged }) => {

    let [message, setMessage] = useState("")

    const handleFlagging = async () => {
        let response = await fetch(`/api/flags/${flagID}/`, {
                method: 'put',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({
                    "id": flagID,
                    "flagged": !isCurrentlyFlagged
                })
            })
            .catch((error) => {
                console.error(error);
            })

        if (response.ok) {
            if (isCurrentlyFlagged) {
                alert("Successfully removed flag.")
            } else {
                alert("Successfully flagged reaction for revision.")
            }
            window.location.reload()
        } else {
            setMessage(`Error ${isCurrentlyFlagged ? "removing flag from" : "flagging"} reaction.` + await response.text())
        }
    }

    useEffect(() => {
        if (!show) {
            setMessage("")
        }
    }, [show])

    if (isCurrentlyFlagged) {
        return (
        <Modal show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={onHide} >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Unflag this reaction
                </Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <p>
                This will remove the flag from this reaction. 
                Please confirm that the reaction information is all correct before submitting.
            </p>
            {message !== "" ? <p style={{color:'maroon'}}>{message}</p> : <></>}
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-outline-danger' 
                    onClick={onHide}>
                Cancel
            </button>
            <button className='btn btn-outline-success' 
                    onClick={handleFlagging}>
                Submit (remove flag)
            </button>
          </Modal.Footer>
        </Modal>
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
                    Flag this reaction?
                </Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <p>
                This will notify other researchers that this data may be inaccurate and should be revised.
                You can sort out flagged results in the advanced search page.
            </p>
            {message !== "" ? <p style={{color:'maroon'}}>{message}</p> : <></>}
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-outline-danger' 
                    onClick={onHide}>
                Cancel
            </button>
            <button className='btn btn-outline-success' 
                    onClick={handleFlagging}>
                Yes, flag this reaction for revision
            </button>
          </Modal.Footer>
    </Modal>
    )
}

export default FlagModal