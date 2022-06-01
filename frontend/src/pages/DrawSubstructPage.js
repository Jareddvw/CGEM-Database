import { useRef } from 'react'
import { useState, useEffect } from 'react'
import MonomerDrawing from '../components/MonomerDrawing'
import { Container, Row, Form, Col } from 'react-bootstrap'
import StructureList from '../components/list_components/StructureList'
import Flex_template from '../components/csv_components/Flex_template'


const DrawSubstructPage = () => {
    var Kekule = require('kekule').Kekule;

    var comp = useRef()

    let composedMolSMILES = ""

    let [reactions, setReactions] = useState([])
    const [SMILES, setSMILES] = useState('')
    const [status, setStatus] = useState(200)

    let queryString = ''
    let composer;

    let makeComposer = () => {
        composer = new Kekule.Editor.Composer(comp.current)
        composer.setCommonToolButtons(['loadData', 'saveData', 'zoomIn', 'zoomOut', 'undo', 'redo', 'copy', 'cut', 'paste']);
        composer.setChemToolButtons(['manipulate', 'erase', 'bond', 'atomAndFormula', 'ring']);
    }

    let generateSMILES = () => {
        console.log(composer)
        var molecule = composer.getChemObj();
        console.log("molecule: " + molecule)
        var smi = Kekule.IO.saveFormatData(molecule, 'smi')
        console.log(smi)
        setSMILES(smi)
    }

    useEffect(() => {
        makeComposer()
    }, [])

    let getReactions = async () => {
        if (SMILES.length > 0) {
            queryString = SMILES.toUpperCase()
            queryString = queryString.split('=').join('%3D')
            queryString = queryString.split('#').join('%23')
            queryString = queryString.split('(').join('%28')
            queryString = queryString.split(')').join('%29')
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
                {SMILES}
                <Row as="h4" className='mt-4 mb-3'>Substructure Search</Row>
                <Row className='mt-3'> Enter a valid SMILES string below. This will return all monomers which
                contain the given molecule as a substructure. 
                Or, if you don't know the substructure's SMILES, draw it instead.</Row>

                <Row style={{width:'75vw'}} className="justify-content-center"> 
                    <Col lg={true}
                        id="composer" 
                        className="mt-4" 
                        ref = {comp}
                        >
                    </Col>
                </Row> 
                
                <Row className='mt-3 mb-3' style={{display:'flex', alignItems:'center'}}> 
                    <button className='btn btn-outline-success mb-3 mt-3 w-25' onClick={generateSMILES}>
                        Generate SMILES
                    </button>
                    <div className="mb-3 mt-3 w-25">
                        {SMILES}
                    </div>
                    <div className="btn btn-outline-primary mb-3 mt-3 w-25" 
                            onClick={getReactions} 
                            onSubmit={getReactions}> 
                        Search 
                    </div>
                </Row>

                {returnStatement()}
            </Container>
        </>
    )
}

export default DrawSubstructPage