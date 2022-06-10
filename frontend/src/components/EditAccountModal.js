import React from 'react'
import { useState } from 'react'
import { Modal, Form } from 'react-bootstrap'

const EditAccountModal = ({ show, onHide, authTokens, userInfo }) => {

    const updateUserInfo = async (e) => {
        e.preventDefault()
        console.log("update user called")
        let response = await fetch('/api/account/details/update', {
            method: 'put',
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({
                'email': (e.target.formBasicEmail.value),
                'username': (e.target.formBasicUsername.value),
                'institution': (e.target.formBasicInstitution.value),
                'orcid_id': (e.target.formBasicOrcid.value)
            })
        }).catch((error) => {
            console.error(error);
        })
        if (response.ok) {
            window.location.reload()
        } else {

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
                    Update account information 
                </Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <Form id="modalform" onSubmit={updateUserInfo}>
                <Form.Group className="mx-5 mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" defaultValue={userInfo.email || ""} />
                </Form.Group>
                <Form.Group className="mx-5 mt-3 mb-4" controlId="formBasicUsername">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="username" defaultValue={userInfo.username || ""} />
                </Form.Group>
                <Form.Group className="mx-5 mt-3 mb-4" controlId="formBasicInstitution">
                    <Form.Label>Institution</Form.Label>
                    <Form.Control type="institution" defaultValue={userInfo.institution || ""} />
                </Form.Group>
                <Form.Group className="mx-5 mt-3 mb-4" controlId="formBasicOrcid">
                    <Form.Label>ORCID ID</Form.Label>
                    <Form.Control type="orcid_id" defaultValue={userInfo.orcid_id || ""} />
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-outline-danger' 
                    onClick={onHide}>
                Cancel
            </button>
            <button className="btn btn-outline-primary" 
                    form="modalform"
                    type="submit">
                Save and submit
            </button>
          </Modal.Footer>
    </Modal>
    )
}

export default EditAccountModal