import { useRef } from 'react'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap'
import StructureList from '../components/list_components/StructureList'
import ReactionList from '../components/list_components/ReactionList'
import ReactPaginate from 'react-paginate'
import VerboseCSV from '../components/csv_components/VerboseCSV'


const DrawSubstructPage = () => {
    var Kekule = require('kekule').Kekule;

    var comp = useRef()

    let [reactions, setReactions] = useState([])
    const [SMILES, setSMILES] = useState(null)
    const [composer, setComposer] = useState(null)
    const [cardView, setCardView] = useState(false)
    let [pageCount, setPageCount] = useState(1)
    let [limit, setLimit] = useState(12)
    let [loading, setLoading] = useState(false)

    let [csvDataLoading, setCSVDataLoading] = useState(false)
    let [csvData, setCSVData] = useState([])

    let queryString = ''

    let makeComposer = () => {
        let newComposer = new Kekule.Editor.Composer(comp.current)
        newComposer.setCommonToolButtons(
            ['loadData', 'saveData', 'zoomIn', 'zoomOut', 'reset', 'undo', 'redo', 'copy', 'cut', 'paste']
        );
        newComposer.setChemToolButtons(['erase', 'manipulate', 'bond', 'atomAndFormula', 'ring', 'charge']);
        setComposer(newComposer)

        // also want to set toggle to active for viewing structures first
        document.getElementById("custom-switch").click()
    }

    let generateSMILES = () => {
        var molecule = composer.getChemObj();
        var smi = Kekule.IO.saveFormatData(molecule, 'smi')
        if (smi.includes(".")) {
            smi = "Error. More than one structure drawn."
            setReactions([])
        } else {
            
        }
        setSMILES(smi)
    }

    useEffect(() => {
        if (SMILES !== null && SMILES !== "Error. More than one structure drawn.") {
            getReactions()
        }
    }, [limit])

    useEffect(() => {
        if (SMILES !== null && SMILES !== "Error. More than one structure drawn.") {
            getReactions(true)
        }
    }, [SMILES])

    useEffect(() => {
        makeComposer()
    }, [])

    let getReactions = async (resetCSVData = false) => {
        setLoading(true)
        if (SMILES === "Error. More than one structure drawn.") {
            setLoading(false)
            return;
        }
        if (SMILES.length > 0) {
            queryString = SMILES
            queryString = queryString.split('=').join('%3D')
            queryString = queryString.split('#').join('%23')
            queryString = queryString.split('(').join('%28')
            queryString = queryString.split(')').join('%29')
            queryString = queryString.split('+').join('%2B')
            queryString = queryString.split('@').join('%40')
        }
        let response = await fetch(`/api/?limit=${limit}&monomer__monomer_smiles__substruct=${queryString}`)
                        .catch((err) => console.log(err))
        if (response.status === 500 || !response.ok) {
            setSMILES("serverError")
            setLoading(false)
            return;
        } 
        let data = await response.json()
        if (response.ok) {
            setReactions(data.results)
            const totalCount = data.count
            setPageCount(Math.ceil(totalCount / limit))

            // if search has good results, get all the data to put in CSV.
            if (resetCSVData === true) {
                getAllCSVdata(totalCount)
            }
        }
        setLoading(false)
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

    const getAllCSVdata = async (totalCount) => {
        setCSVDataLoading(true)
        if (SMILES.length > 0) {
            queryString = SMILES
            queryString = queryString.split('=').join('%3D')
            queryString = queryString.split('#').join('%23')
            queryString = queryString.split('(').join('%28')
            queryString = queryString.split(')').join('%29')
            queryString = queryString.split('+').join('%2B')
            queryString = queryString.split('@').join('%40')
        }
        let response = await fetch(`/api/single?limit=${totalCount}&monomer__monomer_smiles__substruct=${queryString}`)
                        .catch((err) => console.log(err))
        let data = await response.json()
        setCSVDataLoading(false)
        setCSVData(data.results)
    }

    const returnStatement = () => {
        if (SMILES === "Error. More than one structure drawn.") {
            return;
        } else if (SMILES === "serverError") {
            return <div className = "text-center mb-3">  An error occurred! Your SMILES may not be valid. </div>
        } else {
            if (SMILES !== null) {
                return (
                    <>
                    {loading === true ? 
                        (<Row className="align-items-center justify-content-center"> <Spinner animation="border" className="mx-3"/>Waiting for data to load... </Row>) : 
                        ((cardView === true) ?
                        <StructureList reactions={reactions} verbose={false} /> :
                        (<ReactionList reactions={reactions} verbose={false} />))
                    }
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
                    <Row>
                        {<VerboseCSV 
                            reactions={csvData}
                            name="cgemdb_adv_search_results"
                            loading = {csvDataLoading}
                        />}
                    </Row>
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
                <Row className='mt-2 mb-1'> Draw the substructure you want to search for below. </Row>

                <Row className="justify-content-start" style={{width:'100%'}}> 
                    <div
                        id="composer"
                        className="mt-4"
                        ref = {comp}
                        style={{width:'90%'}}
                        >
                    </div>
                </Row> 
                
                <Row className='mx-3 mb-3 align-items-center justify-content-start'> 
                    <button 
                        className='btn btn-outline-primary mb-3 mt-3 w-25 mx-2' 
                        onClick={generateSMILES} >
                        Search
                    </button>
                    <div className="mb-3 mt-3 mx-2 w-25">
                        {(SMILES !== "" && SMILES !== null) ? "Molecule SMILES: " + SMILES : ""}
                    </div>
                    <Col className="mb-3 mt-3 mx-2 w-25">
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="View structures"
                            onClick={() => {setCardView(!cardView)}} >
                        </Form.Check>
                    </Col>
                    <Col style={{width:300, display:'flex', justifyContent:'start', alignItems:'center'}}>
                        Show
                        <Form.Select size='sm' style={{width:100, marginLeft:'0.5em', marginRight:'0.5em'}}
                            onChange={(e)=>setLimit(e.target.value)}>
                            {/* <option value={6}>6</option> */}
                            <option value={12}>12</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={pageCount * limit}>All</option>
                        </Form.Select>
                        entries
                    </Col>
                </Row>

                {returnStatement()}
            </Container>
        </>
    )
}

export default DrawSubstructPage