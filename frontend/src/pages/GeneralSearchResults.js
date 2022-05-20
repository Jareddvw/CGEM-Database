import { useMatch } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Row } from 'react-bootstrap'
import ReactionOrStructureList from '../components/list_components/ReactionOrStructureList'

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
            let response = await fetch(`/api/single/?search=${searchTerm}`)
            let data = await response.json()
            setReactions(data) 
        }
    }
    
    if (searchTerm) {
        return (
            <>
                <Row className = 'mb-4 mt-4'><h4 className='text-center'>Search Results for "{searchTerm}": </h4></Row>
                <ReactionOrStructureList reactions={reactions} />
            </>
          );
    } else {
        return (
            <></>
        )
    }
}

export default GeneralSearch