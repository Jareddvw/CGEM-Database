import { useRef } from 'react'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import StructureList from '../components/list_components/StructureList'
import ReactionList from '../components/list_components/ReactionList'
import ReactPaginate from 'react-paginate'


const DrawSubstructPage = () => {
    var Kekule = require('kekule').Kekule;

    var comp = useRef()

    let [reactions, setReactions] = useState([])
    const [SMILES, setSMILES] = useState(null)
    const [composer, setComposer] = useState(null)
    const [cardView, setCardView] = useState(true)
    let [pageCount, setPageCount] = useState(1)
    let [limit, setLimit] = useState(6)

    let queryString = ''

    let makeComposer = () => {
        let newComposer = new Kekule.Editor.Composer(comp.current)
        newComposer.setCommonToolButtons(
            ['loadData', 'saveData', 'zoomIn', 'zoomOut', 'reset', 'undo', 'redo', 'copy', 'cut', 'paste']
        );
        newComposer.setChemToolButtons(['manipulate', 'erase', 'bond', 'atomAndFormula', 'ring', 'charge']);
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
    }, [SMILES, limit])

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
            queryString = queryString.split('+').join('%2B')
        }
        let response = await fetch(`/api/?limit=${limit}&monomer__monomer_smiles__substruct=${queryString}`)
                        .catch((err) => console.log(err))
        if (response.status === 500 || !response.ok) {
            setSMILES("serverError")
            return;
        } 
        let data = await response.json()
        if (response.ok) {
            setReactions(data.results)
            const totalCount = data.count
            setPageCount(Math.ceil(totalCount / limit))
        }
    }

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        let newReactionsFromServer = await getPaginatedReactions(currentPage);
        setReactions(newReactionsFromServer)
        window.scrollTo(0, document.body.scrollHeight)
    }

    const getPaginatedReactions = async (currentPage) => {
        if (SMILES === "Error. More than one structure drawn.") {
            return;
        }
        if (SMILES.length > 0) {
            queryString = SMILES
            queryString = queryString.split('=').join('%3D')
            queryString = queryString.split('#').join('%23')
            queryString = queryString.split('(').join('%28')
            queryString = queryString.split(')').join('%29')
            queryString = queryString.split('+').join('%2B')
        }
        let offset = ( currentPage - 1 ) * limit
        let response = await fetch(`/api/?limit=${limit}&offset=${offset}&monomer__monomer_smiles__substruct=${queryString}`)
        let data = await response.json()
        return data.results
    }

    const returnStatement = () => {
        if (reactions === []) {
            return (<> Waiting for data to load... </>)
        } else if (SMILES === "Error. More than one structure drawn.") {
            return;
        } else if (SMILES === "serverError") {
            return <div className = "text-center mb-3">  An error occurred! Your SMILES may not be valid. </div>
        } else {
            if (SMILES !== null) {
                return (
                    <>
                    {(cardView === true) ?
                    <StructureList reactions={reactions} verbose={false} /> :
                    <ReactionList reactions={reactions} verbose={false} />}
                    <ReactPaginate
                        previousLabel={"previous"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination justify-content-end"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                    />
                    </>
                )
            } else {
                return (<></>)
            }
        }
    }

    return (
        <>
            <Container>
                <Row as="h4" className='mt-4 mb-3'>Substructure Search</Row>
                <Row className='mt-3'> Draw the substructure you want to search for below. </Row>

                <Row style={{width:'75vw'}} className="justify-content-center"> 
                    <Col
                        id="composer"
                        className="mt-4"
                        ref = {comp}
                        >
                    </Col>
                </Row> 
                
                <Row className='mt-3 mb-3 align-items-center justify-content-center'> 
                    <button 
                        className='btn btn-outline-primary mb-3 mt-3 w-25 mx-2' 
                        onClick={generateSMILES} >
                        Generate SMILES and Search
                    </button>
                    <div className="mb-3 mt-3 mx-2 w-25">
                        {(SMILES !== "" && SMILES !== null) ? "Molecule SMILES: " + SMILES : ""}
                    </div>
                    <div className="mb-3 mt-3 mx-2 w-25">
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="View results as table"
                            onClick={() => {setCardView(!cardView)}} >
                        </Form.Check>
                    </div>
                        Show
                        <Form.Select size='sm' style={{width:100, marginLeft:'1em', marginRight:'1em'}}
                            onChange={(e)=>setLimit(e.target.value)}>
                            <option value={6}>6</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={pageCount * limit}>All</option>
                        </Form.Select>
                        entries
                </Row>

                {returnStatement()}
            </Container>
        </>
    )
}

export default DrawSubstructPage