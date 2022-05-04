import React from 'react'
import { Card, Container, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const NewUserPage = () => {

    const signInLink = (<Link to='/sign-in'>here</Link>);

  return (
    <>
        <Container> 
            <Card style={{width: '50rem'}} className="signInCard my-auto mx-auto">
                <h4 className='mt-5 mb-3 text-center'> Create an Account </h4>
                <Form>
                    <Form.Group className="mx-5 mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="email" placeholder="username" />
                    </Form.Group>
                    {/* <Form.Group className="mx-5 mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="name@address.com" />
                    </Form.Group> */}
                    <Form.Group className="px-10 mx-5 mt-3 mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="password" />
                    </Form.Group>
                    <Form.Group className="px-10 mx-5 mt-3 mb-3" controlId="formBasicPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="password again" />
                    </Form.Group>
                    <Form.Group>
                        <button className="btn btn-outline-success mx-5 mt-3 mb-3"
                                variant="primary" type="submit">
                            Submit
                        </button>
                    </Form.Group>
                    <Form.Group className="mx-5 mt-2 mb-5">
                        <Form.Text muted>
                            Already have an account?
                            Sign in {signInLink}.
                        </Form.Text>
                    </Form.Group>
                </Form>
            </Card>
        </Container>
    </>
  )
}

export default NewUserPage