import React, { useEffect } from 'react'
import { useState } from 'react'
import { Modal, Form, Spinner } from 'react-bootstrap'
import { createBrowserHistory } from 'history'

const BulkApproveModal = ({ show, onHide, authTokens, totalCount }) => {

    const history = createBrowserHistory()
    let [message, setMessage] = useState("")

    let [loading, setLoading] = useState(false)
    let [userEmail, setUserEmail] = useState("")
    let [reactionDrafts, setReactionDrafts] = useState([])

    useEffect(()=> {
        if (totalCount !== undefined) {
            getAllReactionDrafts()
        }
    }, [totalCount])

    const getAllReactionDrafts = async () => {
        setLoading(true)
        let data;
        let reactions = []
        try {
            let response = await fetch(`/api/drafts/?limit=${totalCount}`)
            data = await response.json()
            for (const rxnDraft of data.results) {
                rxnDraft.reactionDraft.id = rxnDraft.id
                rxnDraft.reactionDraft.user = rxnDraft.user
                reactions.push(rxnDraft.reactionDraft)
            }
        } catch {
            setMessage("error getting reaction drafts.")
            setLoading(false)
        }
        console.log("reactions: ")
        console.log(reactions)
        setReactionDrafts(reactions)
        setLoading(false)
    }

    const handleSubmit = async () => {
        let count = 0

        if (!userEmail) {
            setMessage("Please enter a valid user email.")
            return;
        }

        if (userEmail === "null") {
            userEmail = null
            setUserEmail(null)
        }

        setLoading(true)
        for (const reaction of reactionDrafts) {
            console.log(userEmail)
            console.log(reaction.user)
            if (reaction.user !== userEmail) {
                continue;
            }
            let reactionId = reaction.id
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
                setMessage(`Successfully approved ${count} drafts. Error approving draft ${reactionId}. You may not have the proper permissions, or there was a format error. Response text: ${await response1.text()}`)
                setLoading(false)
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
                count += 1
            } else {
                setMessage(`Successfully approved ${count} drafts. Something went wrong with deleting draft ${reactionId}. However, the draft was added successfully to reactions. You may need to delete the draft manually.`)
                setLoading(false)
            }
        }
        if (count > 0) {
            setLoading(false)
            alert(`successfully approved ${count} drafts by ${userEmail}!`)
            window.location.reload()
        } else {
            setLoading(false)
            setMessage("No users with that email address have submitted drafts.")
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
                    Approve multiple reaction drafts
                </Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <h5>Approve drafts by user email</h5>
            <p>
              Make sure you have the proper permissions (deleting drafts and adding reactions) before submitting.
            </p>
            <Form.Group className="mb-3" controlId="formBasicEmail" onChange={e=>setUserEmail(e.target.value)}>
                <Form.Control type="email" placeholder="Enter email" onChange={e=>{setUserEmail(e.target.value); setMessage("")}}/>
            </Form.Group>
            {loading === true ? <Spinner animation="border" /> : <></>}
            {message !== "" ? <p style={{color:'maroon'}}>{message}</p> : <></>}
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-outline-danger' 
                    onClick={onHide}>
                Cancel
            </button>
            <button className='btn btn-outline-success' 
                    onClick={handleSubmit}>
                Approve drafts
            </button>
          </Modal.Footer>
    </Modal>
    )
}

export default BulkApproveModal