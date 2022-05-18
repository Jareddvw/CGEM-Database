import { Container, Form, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {

    const newAccountLink = (<Link to='/create-account'>here</Link>);
    let {loginUser} = useContext(AuthContext)

  return (
      <>
        <Container>
            <Card style={{width: '50rem'}} className="signInCard my-auto mx-auto mt-5">
                <h4 className='mt-5 mb-3 text-center'> Sign in </h4>
                <Form onSubmit={loginUser}>
                    <Form.Group className="mx-5 mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="user123" />
                    </Form.Group>
                    <Form.Group className="mx-5 mt-3 mb-4" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="password" />
                    </Form.Group>
                    <Form.Group className="mx-5 mt-3 mb-3" >
                        <button className="btn btn-outline-success"
                                variant="primary" type="submit">
                            Submit
                        </button>
                    </Form.Group>
                    <Form.Group className="mx-5 mt-2 mb-5">
                        <Form.Text muted>
                            Don't have an account but want to contribute?
                            Create a new account {newAccountLink}.
                        </Form.Text>
                    </Form.Group>
                </Form>
            </Card>
        </Container>
      </>
    
  )
}

export default LoginPage
