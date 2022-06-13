import { createContext, useState, useEffect } from "react"
import jwt_decode from 'jwt-decode'
import { createBrowserHistory } from 'history'

const AuthContext = createContext();

export default AuthContext;

// for some reason authTokens is getting set to NULL when it should not be.

export const AuthProvider = ({ children }) => {

    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(false)

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
                'email': e.target.formBasicEmail.value,
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
            setError(true)
        }
    }

    let updateToken = async () => {
        console.log("updateToken called.")
        let response = await fetch('/api/token/refresh/',{
            method: 'POST',
            headers: {
                'Content-type':'application/JSON'
            },
            body: JSON.stringify({'refresh':authTokens?.refresh})
        })
        if (response.status === 500) {
            console.log("Error connecting to server (server may not be running).") 
            if (loading) {
                setLoading(false)
            }
            return;
        }

        let data = await response.json()

        if (response.ok) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data))
            if (loading) {
                setLoading(false)
            }
        } else if (response.status !== 400) {
            logoutUser()
        }

        if (loading) {
            setLoading(false)
        }
    }

    let logoutUser = () => {
        console.log("logged out user.")
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens')
    }

    // can access username and email through user.username and user.email
    let contextData = {
        authTokens:authTokens,
        user: user,
        loginUser:loginUser,
        logoutUser:logoutUser,
        error: error,
        setError: setError
    }

    useEffect(() => {

        if (loading) {
            updateToken()
        }

        let fourMin = 4 * 60 * 1000 * (Math.random() + 1)
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            } 
        }, fourMin)
        return () => clearInterval(interval);

    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    )
}