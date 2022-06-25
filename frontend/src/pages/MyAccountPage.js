import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Container, Spinner } from 'react-bootstrap'
import EditAccountModal from '../components/EditAccountModal'

const MyAccountPage = () => {

    let [userInfo, setUserInfo] = useState({})
    let [showEditModal, setShowEditModal] = useState(false)
    let [loading, setLoading] = useState(true)

    let {authTokens} = useContext(AuthContext)

    const getUserInfo = async () => {
        let response = await fetch(`/api/account/details`,
        {
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            },
        }).catch((error) => {
            console.error(error);
        })
        let data = await response.json()
        setUserInfo(data)
        setLoading(false)
    }

    useEffect(() => {
        getUserInfo()
        console.log(userInfo)
    }, [])

    return (loading === true ? 
                (<div className = "mt-5 text-center"> 
                    <Spinner animation="border" />
                    <strong> 
                        Waiting for account information to load...
                    </strong> 
                </div>) :
                (<Container className = "mt-5"> 
                    Name: {" " + userInfo.username}
                    <p></p>
                    Email: {" " + userInfo.email}
                    <p></p>
                    Institution: {" " + userInfo.institution}
                    <p></p>
                    ORCID ID: {" " + userInfo.orcid_id}
                    <p></p>
                    Admin user? {userInfo.is_admin === true ? "Yes" : "No"}
                    <p></p>
                    Staff user? {userInfo.is_staff === true ? "Yes" : "No"}
                    <p></p>
                    Date joined: {" " + userInfo.date_joined}
                    <p></p>
                    <button 
                        className = 'mt-3 btn btn-outline-secondary' 
                        onClick={() => setShowEditModal(true)}>
                        Edit my account details
                    </button>
                    <EditAccountModal 
                        show={showEditModal} 
                        onHide={() => setShowEditModal(false)}
                        authTokens = {authTokens} 
                        userInfo = {userInfo} />
                </Container>))
}

export default MyAccountPage