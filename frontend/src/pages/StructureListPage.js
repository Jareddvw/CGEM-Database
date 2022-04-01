import React from 'react'
import { useState, useEffect } from 'react'
import StructureListItem from '../components/StructureListItem'
import MonomerDrawing from '../components/MonomerDrawing'
import SmilesDrawer from 'smiles-drawer'
import { Container, Row, Col, CardGroup, Card } from 'react-bootstrap'
import StructureList from '../components/StructureList'


const StructureListPage = () => {

    let [reactions, setReactions] = useState([])

    useEffect(() => {
        getReactions()
    }, [])

    let getReactions = async () => {
        let response = await fetch('/api/')
        let data = await response.json()
        setReactions(data.results) 
    }
    


    return (
        <>
            <Container>
                {/* <Form className = 'mt-2'>
                        <Form.Control size="lg" type="text" placeholder="Search by Monomer, Flexizyme, Synthetase, tRNA..." 
                            onChange={event => {setSMILES(event.target.value)}} onSubmit={(e) => e.preventDefault()} 
                            onKeyPress={handleEnterKeyPressed} />  
                </Form> */}

                {reactions != null ? <StructureList reactions={reactions} /> : <> Waiting for data to load... </>}
            </Container>
        </>
    )

}

export default StructureListPage