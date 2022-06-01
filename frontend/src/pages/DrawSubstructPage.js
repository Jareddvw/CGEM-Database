import { useRef } from 'react'
import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import StructureList from '../components/list_components/StructureList'


const DrawSubstructPage = () => {
    var Kekule = require('kekule').Kekule;

    var comp = useRef()

    let [reactions, setReactions] = useState([])
    const [SMILES, setSMILES] = useState(null)
    const [composer, setComposer] = useState(null)

    let queryString = ''

    let makeComposer = () => {
        let newComposer = new Kekule.Editor.Composer(comp.current)
        newComposer.setCommonToolButtons(['loadData', 'saveData', 'zoomIn', 'zoomOut', 'reset', 'undo', 'redo', 'copy', 'cut', 'paste']);
        newComposer.setChemToolButtons(['manipulate', 'erase', 'bond', 'atomAndFormula', 'ring']);
        setComposer(newComposer)
    }

    let generateSMILES = () => {
        var molecule = composer.getChemObj();
        var smi = Kekule.IO.saveFormatData(molecule, 'smi')
        if (smi.includes(".")) {
            smi = "Error. More than one structure drawn."
            setReactions([])
        }
        setSMILES(smi)
    }

    useEffect(() => {
        if (SMILES !== null) {
            getReactions()
        }
    }, [SMILES])

    useEffect(() => {
        makeComposer()
    }, [])

    let getReactions = async () => {
        if (SMILES === "Error. More than one structure drawn.") {
            return;
        }
        if (SMILES.length > 0) {
            queryString = SMILES
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
                <Row className='mt-3'> Draw the substructure you want to search for below. 
                Note: the SMILES substructure search we use does not currently work on structures with charged atoms. </Row>

                <Row style={{width:'75vw'}} className="justify-content-center"> 
                    <Col
                        id="composer"
                        className="mt-4"
                        ref = {comp}
                        >
                    </Col>
                </Row> 
                
                <Row className='mt-3 mb-3 align-items-center'> 
                    <button 
                        className='btn btn-outline-primary mb-3 mt-3 w-25 mx-3' 
                        onClick={generateSMILES} >
                        Generate SMILES and Search
                    </button>
                    <div className="mb-3 mt-3 mx-3 w-25">
                        {(SMILES !== "" && SMILES !== null) ? "Molecule SMILES: " + SMILES : ""}
                    </div>
                </Row>

                {returnStatement()}
            </Container>
        </>
    )
}

export default DrawSubstructPage