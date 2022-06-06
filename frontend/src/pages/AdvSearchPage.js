import { Container, Row, Col, Button, Form, Stack } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import ReactionList from '../components/list_components/ReactionList'
import StructureList from '../components/list_components/StructureList'
import ReactionOrStructureList from '../components/list_components/ReactionOrStructureList'
import VerboseCSV from '../components/csv_components/VerboseCSV'
import ReactPaginate from 'react-paginate'

const AdvSearchPage = () => {

    let [queries, setQueries] = useState({})
    let [search, setSearch] = useState("")
    let [ordering, setOrdering] = useState("&ordering=id")
    let [reactions, setReactions] = useState([])
    let [cardView, setCardView] = useState(false)
    let [limit, setLimit] = useState(6)
    let [resultCount, setResultCount] = useState(0)
    let [pageCount, setPageCount] = useState(1)

  // for /api/single, use setReactions(data)
  // for /api/, use setReactions(data.results)
  let getReactions = async () => {
    let response = await fetch(`/api/single/?limit=${limit}${ordering}` + 
                                Object.keys(queries).map((key) => 
                                    key + "=" + queries[key] + "").join("") +
                                search)
    if (response.status === 500) {
        setReactions("serverError")
        return;
    }
    let data = await response.json()

    setReactions(data.results)
    const totalCount = data.count
    setPageCount(Math.ceil(totalCount / limit))
    setResultCount(totalCount)
    let length = await data.length
    if (length === 0) {
        setReactions("blank")
    }
  }

  useEffect(() => {
      if (reactions.length !== 0) {
        getReactions()
      }
    }, [limit])

  const handleEnterKeyPressed = (event) => {
    if (event.key === 'Enter') {
        getReactions()
    }
  }

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    let newReactionsFromServer = await getPaginatedReactions(currentPage);
    setReactions(newReactionsFromServer)
    window.scrollTo(0, document.body.scrollHeight)
}

const getPaginatedReactions = async (currentPage) => {
    let offset = ( currentPage - 1 ) * limit
    let response = await fetch(`/api/single/?limit=${limit}&offset=${offset}${ordering}` + 
                                Object.keys(queries).map((key) => 
                                key + "=" + queries[key] + "").join("") +
                                search)
    let data = await response.json()
    return data.results
}
  

  return (
    <>
        <Container onKeyPress={handleEnterKeyPressed}>
            <Row as="h4" className='mt-4 mb-3'>Advanced Reaction Search</Row>
            <Row className='mt-3'> This will return all reactions that meet the selected criteria 
            (every additional filter will be joined with an AND statement). For search filters, 
            only results which EXACTLY match the input will be included (they are case sensitive). 
            <p></p>Input to "Other search terms" does not need to be exact. 
            You can also use this field to search for multiple mutations (e.g "Y271G L274M C313V") 
            or for multiple additional organisms.
            Empty fields will be ignored so you don’t need to fill in every box. </Row>
            <Row></Row>
            {Object.keys(queries).map((key) => 
                                    key + "=" + queries[key] + "").join("")}
            
            <Row className='mt-3'> 
            <Col className='mt-3'> Parent synthetase (if synthetase) 
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries({
                            ...queries,
                            "&synthetase__parent_synthetase__parent_name": e.target.value
                        })} 
                        type="text" placeholder="" >
                    </Form.Control>
                </div>
            </Col>
            <Col className='mt-3'> Flexizyme name (if flexizyme) 
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries({
                            ...queries,
                            "&flexizyme__flex_name": e.target.value
                        })} 
                        type="text" placeholder="" >
                    </Form.Control>
                </div>
            </Col>
            <Col className='mt-3'> Monomer name
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries({
                            ...queries,
                            "&monomer__monomer_name": e.target.value
                        })}  
                        type="text" placeholder="" >
                    </Form.Control>
                </div>
            </Col>
            <Col className='mt-3'> Monomer LG
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries({
                            ...queries,
                            "&monomer__monomer_LG": e.target.value
                        })}  
                        type="text" placeholder="" >
                    </Form.Control>
                </div>
            </Col>
            <Col className='mt-3'> Organisms (for synthetases)
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries({
                            ...queries,
                            "&synthetase__organisms__organism_name": e.target.value
                        })}   
                        type="text" placeholder="" >
                    </Form.Control>
                </div>
            </Col>
            <Col className='mt-3'> Reference DOI 
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries({
                            ...queries,
                            "&references__DOI": e.target.value
                        })}   
                        type="text" placeholder="" >
                    </Form.Control>
                </div>
            </Col>
            <Col className='mt-3'> Substructure SMILES
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>{
                            let queryString = e.target.value
                            if (queryString.length > 0) {
                                queryString = queryString.toUpperCase()
                                queryString = queryString.split('=').join('%3D')
                                queryString = queryString.split('#').join('%23')
                                queryString = queryString.split('(').join('%28')
                                queryString = queryString.split(')').join('%29')
                            }
                            setQueries({
                                ...queries,
                                "&monomer__monomer_smiles__substruct": queryString
                            }
                        )}}
                        type="text" placeholder="" >
                    </Form.Control>
                </div>
            </Col>
            </Row>

            <hr className='mt-4 mb-2' style={{color:'black', backgroundColor:'black'}}></hr>

            <Row>
            <Col className='mt-3'> Other search terms:
                <div style={{width:625}}>
                    <Form.Control
                        onChange={(e)=>setSearch("&search=" + e.target.value)} 
                        onSubmit={(e)=>setSearch("&search=" + e.target.value)} 
                        type="text" placeholder="" >
                    </Form.Control>
                </div>
            </Col>
            <Col className='mt-3'> Order results by: 
                <div style={{width:300}}>
                    <select 
                        onChange={(e)=>setOrdering("&ordering=" + e.target.value)} 
                        onSubmit={(e)=>setOrdering("&ordering=" + e.target.value)} className="form-select">
                        <option value="id">Database ID (default)</option>
                        <option value="-internal_percent">Internal incorporation %</option>
                        <option value="-n_term_percent">N-terminal incorporation %</option>
                        <option value="-assay__acylation_yield">Microhelix assay yield</option>
                    </select>
                </div>
            </Col>
            <Col className='mt-3'> Display:
                <div style={{width:300}}>
                    <select
                        onChange={(e)=>setCardView(e.target.value)} 
                        onSubmit={(e)=>setCardView(e.target.value)} className="form-select">
                        <option value={false}> List view </option>
                        <option value={true}> Card (structure) view </option>
                    </select>
                </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    <button className="btn btn-outline-primary mb-3 mt-4 w-25" 
                            onClick={getReactions} 
                            onSubmit={getReactions}> 
                        Search 
                    </button>
                </Col>
            </Row>
        </Container>
        {(reactions.length !== 0) ? 
            ((reactions === "blank") ? 
                <h6 className="text-center">No reactions with those parameters found.</h6> : 
                (reactions === "serverError") ?
                    <h6 className="text-center">Server error (server may not be running).</h6> :
                    <Container>
                        <Row className = 'mb-4 mt-4 align-items-center'>
                            <div style={{padding:0, width:'200px'}}>
                                Number of results: {resultCount} 
                            </div>
                            Show
                            <Form.Select size='sm' style={{width:100, marginLeft:'0.5em', marginRight:'0.5em'}}
                                onChange={(e)=>setLimit(e.target.value)}>
                                <option value={6}>6</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={pageCount * limit}>All</option>
                            </Form.Select>
                            entries per page
                        </Row>
                        <Row className="mt-3">
                            {<ReactionOrStructureList 
                                reactions={reactions} 
                                cardView={cardView} 
                                verbose={true}/>}
                        </Row>
                        <ReactPaginate
                            previousLabel={"previous"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination justify-content-end mt-3"}
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
                            {<VerboseCSV reactions={reactions} 
                            name="cgemdb_adv_search_results" />}
                        </Row>
                    </Container>
                ) : 
            <></>}
    </>
  )
}

export default AdvSearchPage