import { createContext, useState, useEffect } from "react"
import jwt_decode from 'jwt-decode'
import { createBrowserHistory } from 'history'

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {

    let initialTokens = null;
    let initialUser = null;
    const getAuthTokens = () => {
        if (localStorage.getItem('authTokens')) {
            initialTokens = JSON.parse(localStorage.getItem('authTokens'));
            initialUser = jwt_decode(initialTokens.access)
        }
        return initialTokens
    }
    const getUser = () => {
        if (localStorage.getItem('authTokens')) {
            initialUser = jwt_decode(initialTokens.access)
        }
        return initialUser
    }

    let [authTokens, setAuthTokens] = useState(() => getAuthTokens());
    let [user, setUser] = useState(() => getUser());

    const history = createBrowserHistory()

    let loginUser = async (e) => {
        e.preventDefault();
        let response = await fetch('/api/token/',{
            method: 'POST',
            headers: {
                'Content-type':'application/JSON'
            },
            body: JSON.stringify({
                'username': e.target.formBasicUsername.value, 
                'password': e.target.formBasicPassword.value
            })
        })
        let data = await response.json();
        
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data))
            history.push('/')
            window.location.reload()
        } else {
            alert("something went wrong!")
        }
    }

    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens')
        history.push('/sign-in')
        window.location.reload()
    }

    // can access username and email through user.username and user.email
    let contextData = {
        user: user,
        loginUser:loginUser,
        logoutUser:logoutUser
    }

    return (
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}