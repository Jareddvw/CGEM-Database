import React, { useState } from 'react'
import { Card, Container, Form, Col, Row, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { createBrowserHistory } from 'history'
import AlertModal from '../components/rxn_page_components/AlertModal';

const NewUserPage = () => {

    let [alertText, setAlertText] = useState("")
    let [alertHeader, setAlertHeader] = useState("")
    let [showAlertModal, setShowAlertModal] = useState(false)


    const signInLink = (<Link to='/sign-in'>here</Link>);
    const history = createBrowserHistory()

    const handleSubmit = async (e) => {
        e.preventDefault();
        let response = await fetch('/api/account/register',{
            method: 'POST',
            headers: {
                'Content-type':'application/JSON'
            },
            body: JSON.stringify({
                'email': e.target.formBasicEmail.value, 
                'username': e.target.formBasicUsername.value,
                'password': e.target.formBasicPassword.value,
                'password2': e.target.formBasicPassword2.value,
                'institution': e.target.institution.value,
                'orcid_id': e.target.orcid_id.value
            })
        })
        let data = await response.json();
        
        if (response.ok) {
            if (!data.response || data.response !== "successfully registered new user.") {
                setAlertHeader("Email address error")
                setAlertText(`${data.email}`)
                setShowAlertModal(true)
                return
            }
            setAlertHeader("Success!")
            setAlertText("sign in to your account on the login page.")
            setShowAlertModal(true)
        } else {
            console.log(data)
            alert("something went wrong!")
        }
    }

  return (
    <>
        <Container> 
            <Card style={{width: '50vw'}} className="signInCard my-auto mx-auto mt-5">
                <h4 className='mt-5 mb-3 text-center'> Create an Account </h4>
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mx-5 mb-3" controlId="formBasicEmail">
                        <Form.Label>Email <span style={{color:'red', fontWeight:'bold'}}>*</span></Form.Label>
                        <Form.Control type="email" placeholder="name@address.com" required/>
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid email.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mx-5 mb-3" controlId="formBasicUsername">
                        <Form.Label> Name <span style={{color:'red', fontWeight:'bold'}}>*</span> </Form.Label>
                        <Form.Control type="username" placeholder="my name" required/>
                    </Form.Group>
                    <Form.Group className="mx-5 mb-3" default="" controlId="institution">
                        <Form.Label>Institution</Form.Label>
                        <Form.Control type="institution" placeholder="institution (not required)"/>
                    </Form.Group>
                    <Form.Group className="mx-5 mb-3" default="" controlId="orcid_id">
                        <Form.Label>ORCID iD</Form.Label>
                        <Form.Control type="orcid" placeholder="16-digit ORCID id (not required)"/>
                    </Form.Group>
                    <Form.Group className="px-10 mx-5 mt-3 mb-3" controlId="formBasicPassword">
                        <Form.Label>Password <span style={{color:'red', fontWeight:'bold'}}>*</span></Form.Label>
                        <Form.Control type="password" placeholder="password" required />
                    </Form.Group>
                    <Form.Group className="px-10 mx-5 mt-3 mb-3" controlId="formBasicPassword2">
                        <Form.Label>Confirm Password <span style={{color:'red', fontWeight:'bold'}}>*</span></Form.Label>
                        <Form.Control type="password" placeholder="password again" required />
                    </Form.Group>
                    <Form.Group className="px-10 mx-5 mt-3 mb-3">
                        <button style={{width:'100px'}} className="btn btn-outline-success mt-3 mb-3"
                                variant="primary" type="submit">
                            Submit
                        </button>
                    </Form.Group>
                    <Form.Group className="mx-5 mt-2 mb-5" >
                        <Form.Text muted>
                            Already have an account?
                            Sign in {signInLink}.
                        </Form.Text>
                    </Form.Group>
                </Form>
            </Card>
            <AlertModal
                show={showAlertModal} 
                onHide={() => {
                    setShowAlertModal(false); 
                    setAlertHeader(""); 
                    if (alertHeader === "Success!") {
                        history.push('/sign-in')
                        window.location.reload()
                    }
                }}
                headerText = {alertHeader}
                bodyText = {alertText} />
        </Container>
    </>
  )
}

export default NewUserPage