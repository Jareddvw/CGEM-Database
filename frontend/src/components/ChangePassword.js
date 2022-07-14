import React from 'react'
import { useState } from 'react'
import { Modal, Form } from 'react-bootstrap'

const ChangePasswordModal = ({ show, onHide, authTokens, userInfo }) => {

    let [message, setMessage] = useState("")

    const updateUserInfo = async (e) => {
        e.preventDefault()
        if (e.target.newPassword.value !== e.target.newPasswordConfirm.value) {
            setMessage("New passwords don't match.")
            return;
        }
        console.log("update user called")
        let response = await fetch('/api/account/change-password', {
            method: 'put',
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({
                'old_password': (e.target.oldPassword.value),
                'new_password': (e.target.newPassword.value)
            })
        }).catch((error) => {
            console.error(error);
        })
        if (response.ok) {
            alert("successfully changed password!")
            window.location.reload()
        } else {
            setMessage("Error changing your password. Please try again.")
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
                    Change password 
                </Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <Form id="modalform" onSubmit={updateUserInfo}>
                <Form.Group className="mx-5 mb-3" controlId="oldPassword">
                    <Form.Label>Old password</Form.Label>
                    <Form.Control type="password"/>
                </Form.Group>
                <Form.Group className="mx-5 mt-3 mb-4" controlId="newPassword" onChange={()=>setMessage("")}>
                    <Form.Label>New password</Form.Label>
                    <Form.Control type="password"/>
                </Form.Group>
                <Form.Group className="mx-5 mt-3 mb-4" controlId="newPasswordConfirm" onChange={()=>setMessage("")}>
                    <Form.Label>Confirm new password</Form.Label>
                    <Form.Control type="password"/>
                </Form.Group>
            </Form>
            {message !== "" ? <p style={{color:'maroon'}}>{message}</p> : <></>}
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

export default ChangePasswordModal