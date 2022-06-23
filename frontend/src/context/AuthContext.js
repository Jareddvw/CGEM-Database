import { createContext, useState, useEffect } from "react"
import jwt_decode from 'jwt-decode'
import { createBrowserHistory } from 'history'

const AuthContext = createContext();

export default AuthContext;

// for some reason authTokens is getting set to NULL when it should not be.

export const AuthProvider = ({ children }) => {

    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(false)

    const getAuthTokens = () => {
        if (localStorage.getItem('authTokens')) {
            let initialTokens = JSON.parse(localStorage.getItem('authTokens'));
            return initialTokens
        }
        return null
    }
    const getUser = () => {
        if (localStorage.getItem('authTokens')) {
            let initialTokens = JSON.parse(localStorage.getItem('authTokens'));
            let initialUser = jwt_decode(initialTokens.access)
            console.log("user " + initialUser)
            return initialUser
        }
        console.log("no user")
        return null;
    }

    let [authTokens, setAuthTokens] = useState(() => getAuthTokens());
    let [user, setUser] = useState(() => getUser());
    console.log(user)

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
            localStorage.setItem('access_created_time', Date.now())
            history.push('/')
            window.location.reload()
        } else {
            setError(true)
        }
    }

    let updateToken = async () => {
        console.log("updateToken called.")
        // ten minutes in milliseconds
        let tenMinutes = 1000 * 60 * 10
        let prevAccessTime = localStorage.getItem('access_created_time')
        if (prevAccessTime) {
            if (Date.now() - prevAccessTime < tenMinutes) {
                console.log("no need to update token")
                setLoading(false)
                return;
            }
        }

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
            localStorage.setItem('access_created_time', Date.now())
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
        localStorage.removeItem('access_created_time')
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
        if (loading && localStorage.getItem('authTokens')) {
            updateToken()
        }

        let fourMin = 4 * 60 * 1000 * (Math.random() + 1)
        let interval = setInterval(() => {
            if (localStorage.getItem('authTokens')) {
                updateToken()
            } 
        }, fourMin)
        return () => clearInterval(interval);

    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}