import { Container, Form, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import AlertModal from '../components/rxn_page_components/AlertModal';

const LoginPage = () => {

    const newAccountLink = (<Link to='/create-account'>here</Link>);
    let { loginUser, error, setError } = useContext(AuthContext)

    let [showAlertModal, setShowAlertModal] = useState(false)

  return (
      <>
        <Container>
            <Card style={{width: 600}} className="signInCard my-auto mx-auto mt-5">
                <h4 className='mt-5 mb-3 text-center'> Sign in </h4>
                <Form onSubmit={loginUser} className='mx-3'>
                    <Form.Group className="mx-5 mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="user123@domain.com" required />
                    </Form.Group>
                    <Form.Group className="mx-5 mt-3 mb-4" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="password" required />
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
            <AlertModal 
                headerText = "Login Error"
                bodyText = "Something went wrong! Check that you are using the correct email and not a username to log in."
                show={error === true ? true : false} 
                onHide={() => {
                    setShowAlertModal(false); 
                    setError(false)
                }}
            />
        </Container>
      </>
  )
}

export default LoginPage
