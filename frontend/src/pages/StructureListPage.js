import React from 'react'
import { useState, useEffect } from 'react'
import MonomerDrawing from '../components/MonomerDrawing'
import { Container, Row, Form } from 'react-bootstrap'
import StructureList from '../components/list_components/StructureList'

const StructureListPage = () => {

    let [reactions, setReactions] = useState([])
    const [SMILES, setSMILES] = useState('')

    useEffect(() => {
        getReactions()
    }, [])

    useEffect(() => {
    }, [SMILES])

    let getReactions = async () => {
        let response = await fetch('/api/')
        let data = await response.json()
        setReactions(data.results) 
    }

    return (
        <>
            <Container>
                <Row className='mt-3'> Monomer SMILES: 
                    <div style={{width:700}}>
                        <Form.Control
                            onChange={(e)=>setSMILES(e.target.value)} 
                            onSubmit={(e)=>setSMILES(e.target.value)} 
                            type="text" placeholder="SMILES" >
                        </Form.Control>
                    </div>
                </Row>
                {SMILES !== '' ? 
                    (<Row className='align-items-center'>
                        <MonomerDrawing smiles={SMILES} width='400' height='300' />
                    </Row>) : <Row className='mb-3' ></Row>}
                {reactions != null ? <StructureList reactions={reactions} /> : <> Waiting for data to load... </>}
            </Container>
        </>
    )

}

export default StructureListPage