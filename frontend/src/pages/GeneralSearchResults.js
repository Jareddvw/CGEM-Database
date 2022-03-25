import { useMatch } from 'react-router-dom'
import ReactionList from '../components/ReactionList'
import { useState, useEffect } from 'react'
import { Row } from 'react-bootstrap'

const GeneralSearch = () => {

    const match = useMatch({
        path: "/search/:id",
        strict: true,
        sensitive: true,
    });

    let searchTerm = match.params.id

    let [reactions, setReactions] = useState([])

    useEffect(() => {
        getReactions()
    }, [])

    let getReactions = async () => {
        if (searchTerm) {
            if (searchTerm.charAt(searchTerm.length - 1) === '?'){
                searchTerm.slice(0, -1)
            }
            let response = await fetch(`/api/?search=${searchTerm}`)
            let data = await response.json()
            setReactions(data.results) 
        }
    }
    
    if (searchTerm) {
        return (
            <>
                <Row className = 'mb-3 mt-3'><h4 className='text-center'>Search Results for "{searchTerm}" </h4></Row>
                <ReactionList reactions={reactions} />
            </>
          );
    } else {
        return (
            <></>
        )
    }
}

export default GeneralSearch