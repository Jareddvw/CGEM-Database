import { useMatch } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Container, Row, Form } from 'react-bootstrap'
import ReactionOrStructureList from '../components/list_components/ReactionOrStructureList'

const GeneralSearch = () => {

    const match = useMatch({
        path: "/search/:id",
        strict: true,
        sensitive: true,
    });

    let searchTerm = match.params.id

    let [reactions, setReactions] = useState([])
    let [cardView, setCardView] = useState(false)

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
            <Container>
                <Row className = 'mb-4 mt-5'><h4 className='text-center'>Search Results for "{searchTerm}": </h4></Row>
                <Row className = 'mb-4 mt-4 w-25 justify-content-center'>
                    <div className="text-center">
                        <Form.Check
                            inline
                            type="switch"
                            id="custom-switch"
                            label="View structures"
                            onClick={() => {setCardView(!cardView)}} >
                        </Form.Check>
                    </div>
                </Row>
                <ReactionOrStructureList cardView={cardView} reactions={reactions} verbose={false} />
            </Container>
          );
    } else {
        return (
            <></>
        )
    }
}

export default GeneralSearch