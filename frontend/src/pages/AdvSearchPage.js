import { Container, Row, Col, Button, Form, Stack, Spinner } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import ReactionList from '../components/list_components/ReactionList'
import StructureList from '../components/list_components/StructureList'
import ReactionOrStructureList from '../components/list_components/ReactionOrStructureList'
import VerboseCSV from '../components/csv_components/VerboseCSV'
import ReactPaginate from 'react-paginate'
import SearchFilter from '../components/SearchFilter'

const AdvSearchPage = () => {

    let [queries, setQueries] = useState({})
    let [search, setSearch] = useState("")
    let [ordering, setOrdering] = useState("&ordering=id")
    let [reactions, setReactions] = useState([])
    let [cardView, setCardView] = useState(false)
    let [limit, setLimit] = useState(12)
    let [resultCount, setResultCount] = useState(0)
    let [pageCount, setPageCount] = useState(1)

    let [filterIndices, setFilterIndices] = useState([1])
    let [filterCountUp, setFilterCountUp] = useState(1)
    let [csvDataLoading, setCSVDataLoading] = useState(false)
    let [csvData, setCSVData] = useState([])

    let [searchLoading, setSearchLoading] = useState(false)

  // for /api/single, use setReactions(data)
  // for /api/, use setReactions(data.results)
  let getReactions = async () => {
    setSearchLoading(true)
    let filters = ""
    for (const [key, value] of Object.entries(queries)) {
        filters += "&" + value[0] + "=" + value[1]
    }
    // console.log(filters)
    let response = await fetch(`/api/single/?limit=${limit}${ordering}` + 
                                filters + 
                                search)
    if (response) {
        setSearchLoading(false)
    }
    if (response.status === 500) {
        setReactions("serverError")
        return;
    } else if (response.status >= 400) {
        setReactions("blank")
        return;
    }
    let data = await response.json()

    setReactions(data.results)
    const totalCount = data.count
    if (totalCount === 0) {
        setReactions("blank")
    }
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
    setSearchLoading(true)
    let filters = ""
    for (const [key, value] of Object.entries(queries)) {
        filters += "&" + value[0] + "=" + value[1]
    }
    let offset = ( currentPage - 1 ) * limit
    let response = await fetch(`/api/single/?limit=${limit}&offset=${offset}${ordering}` + 
                                filters +
                                search)
    let data = await response.json()
    setSearchLoading(false)
    return data.results
}

// download all data from advanced search in CSV format, not just those returned on current page.
const getAllCSVdata = async (pagesCount, limit) => {
    setCSVDataLoading(true)
    let filters = ""
    for (const [key, value] of Object.entries(queries)) {
        filters += "&" + value[0] + "=" + value[1]
    }
    let response = await fetch(`/api/single/?limit=${pagesCount * limit}&${ordering}` + 
                                filters +
                                search)
    let data = await response.json()
    setCSVDataLoading(false)
    setCSVData(data.results)
}

  return (
    <>
        <Container onKeyPress={handleEnterKeyPressed}>
            <Row as="h4" className='mt-4 mb-2'>Advanced Reaction Search</Row>
            <Row className='mt-3 mb-2'> This will return all reactions that meet the selected criteria 
            (every additional filter will be joined with an AND statement). Filters are not case sensitive. 
            To search for multiple mutations, write them in the "Other search terms" box. </Row>
            <Row></Row>
            {/* {Object.keys(queries).map((key) => 
                                    key + "=" + queries[key] + "").join("")} */}

            <div className="wrapper mt-2">
            <div className='insidewrapper'>
                {filterIndices.map(index => 
                    <Row className='align-items-center search-filter justify-content-between' style={{width:'100%', marginLeft:0}} key={index}>
                        <SearchFilter setQueries={setQueries} queries={queries} filterID ={index} key={index} />
                        <button className='btn btn-outline-danger mt-3' 
                                style={{width:'8em'}}
                                onClick={() => {
                                    if (filterIndices.length >= 1) {
                                        delete queries[index]
                                        setFilterIndices(filterIndices => filterIndices.filter(value => value !== index))
                                    }
                                }}> 
                            Remove
                        </button>
                    </Row>
                )}
                <button className = 'btn btn-outline-success mt-3' style={{width:'10em'}} 
                        onClick = {() => {
                            setFilterIndices(filterIndices => [...filterIndices, filterCountUp + 1])
                            setFilterCountUp(filterCountUp + 1)
                        }}> 
                    {"+ Add Filter"}
                </button>
                
            </div>
            </div>

            
            

            <hr className='mt-4 mb-2' style={{color:'black', backgroundColor:'black'}}></hr>
            
            <Row className="align-items-center justify-content-start">
            <div className='mt-3 w-auto'>
                <div style={{width:495}}>
                    <Form.Control
                        onChange={(e)=>setSearch("&search=" + e.target.value)} 
                        onSubmit={(e)=>setSearch("&search=" + e.target.value)} 
                        type="text" placeholder="Other search terms" >
                    </Form.Control>
                </div>
            </div>
            <div className='mt-3 w-auto' style={{display:'flex', flexDirection:"row", alignItems:'center'}}>
                <div className='mx-3'>
                    Order results by: 
                </div>
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
            </div>
            </Row>
            <Row className="justify-content-between">
                <Col>
                    <button className="btn btn-outline-primary mb-3 mt-4" 
                            onClick={() => getReactions()} 
                            onSubmit={() => getReactions()} 
                            style={{width:250}}> 
                        Search 
                    </button>
                </Col>
                {searchLoading === true ? (<Spinner className="mt-4" animation="border" variant="success"></Spinner>) : <></>}
            </Row>
        </Container>
        {(reactions.length !== 0) ? 
            ((reactions === "blank") ? 
                <h6 className="text-center mt-3">No reactions with those parameters found.</h6> : 
                (reactions === "serverError") ?
                    <h6 className="text-center mt-3">Server error (server may not be running).</h6> :
                    <Container>
                        <Row className = 'mb-4 mt-4 align-items-center'>
                            <div style={{padding:0, width:'200px'}} className="mr-3">
                                Number of results: {resultCount} 
                            </div>
                            <Row className='w-auto align-items-center mx-5'>
                                Show
                                <Form.Select size='sm' style={{width:100, marginLeft:'0.5em', marginRight:'0.5em'}}
                                    onChange={(e)=>setLimit(e.target.value)}>
                                    {/* <option value={6}>6</option> */}
                                    <option value={12}>12</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={pageCount * limit}>All</option>
                                </Form.Select>
                                entries per page
                            </Row>
                            <div style={{width:300}}>
                                <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label="View structures"
                                        onClick={() => {setCardView(!cardView)}} >
                                </Form.Check>
                            </div>
                        </Row>
                        <Row className="mt-3">
                            {<ReactionOrStructureList 
                                reactions={reactions} 
                                cardView={cardView} 
                                verbose={true}/>}
                        </Row>
                        <Row className="mx-2 mt-4 mb-5" style={{justifyContent:'space-between', alignItems:'center'}}>
                            {
                                csvData.length === 0 && csvDataLoading === false ?
                                <button className="btn btn-outline-secondary" style={{width:'290px'}} 
                                    onClick={() => getAllCSVdata(pageCount * limit, limit)}>
                                    <span style={{marginRight:"10px"}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                    </svg>
                                    </span>
                                    Download all results (CSV)
                                </button> :
                                <VerboseCSV 
                                    reactions={csvData}
                                    name="cgemdb_adv_search_results"
                                    loading = {csvDataLoading}
                                />  
                            }
                            <ReactPaginate
                                previousLabel={"previous"}
                                nextLabel={"next"}
                                breakLabel={"..."}
                                pageCount={pageCount}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination justify-content-end w-auto mt-2"}
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
                        </Row>
                    </Container>
                ) : 
            <></>}
    </>
  )
}

export default AdvSearchPage