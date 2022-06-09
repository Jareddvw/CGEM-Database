import { useState, useEffect } from 'react'
import MonomerDrawing from '../components/rxn_page_components/MonomerDrawing'
import { Container, Row, Form} from 'react-bootstrap'
import StructureList from '../components/list_components/StructureList'

const StructureListPage = () => {

    let [reactions, setReactions] = useState([])
    const [SMILES, setSMILES] = useState('')

    let queryString = ''

    useEffect(() => {
    }, [SMILES])

    let getReactions = async () => {
        if (SMILES.length > 0) {
            queryString = SMILES
            queryString = queryString.split('=').join('%3D')
            queryString = queryString.split('#').join('%23')
            queryString = queryString.split('(').join('%28')
            queryString = queryString.split(')').join('%29')
            queryString = queryString.split('+').join('%2B')
        }
        let response = await fetch(`/api/?monomer__monomer_smiles__substruct=${queryString}`)
                        .catch((err) => console.log(err))
        if (response.status === 500 || !response.ok) {
            setSMILES("serverError")
            return;
        } 
        let data = await response.json()
        if (response.ok) {
            setReactions(data.results)
        } 
    }

    const handleEnterKeyPressed = (event) => {
        if (event.key === 'Enter') {
            getReactions()
        }
    }

    const returnStatement = () => {
        if (reactions === []) {
            return (<> Waiting for data to load... </>)
        } else if (SMILES === "serverError") {
            return <div className = "text-center mb-3">  An error occurred! Your SMILES may not be valid. </div>
        } else {
            return (<StructureList reactions={reactions} verbose={false} />)
        } 
    }

    return (
        <>
            <Container>
                <Row as="h4" className='mt-4 mb-3'>Substructure Search</Row>
                <Row className='mt-3'>
                    Enter a valid SMILES string below. This will return all monomers which
                    contain the given molecule as a substructure. 
                </Row>

                <Row className='mt-3 mb-3' style={{display:'flex', alignItems:'center'}}> 
                    Substructure SMILES: 
                    <div style={{width:700}}>
                        <Form.Control
                            onChange={(e)=>setSMILES(e.target.value)} 
                            onSubmit={()=>getReactions()} 
                            onKeyPress={handleEnterKeyPressed}
                            type="text" placeholder="SMILES" >
                        </Form.Control>
                    </div>
                    <div className="btn btn-outline-primary mb-3 mt-3 w-25"
                            onClick={getReactions} 
                            onSubmit={getReactions}> 
                        Search 
                    </div>
                </Row>

                {(SMILES !== '') ? 
                    (<Row style={{display:'flex', justifyContent:'center'}}>
                        <MonomerDrawing smiles={SMILES} 
                                        width={Math.min(300 + SMILES.length * 20, 1000)} 
                                        height={300} />
                    </Row>) : 
                    <Row className='mb-3' ></Row>} 


                {returnStatement()}
            </Container>
        </>
    )

}

export default StructureListPage