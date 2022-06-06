import React from 'react'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import ReactionOrStructureList from '../components/list_components/ReactionOrStructureList'

import ReactPaginate from 'react-paginate'

// Page for list of all reactions in database (different from search results page)

const ReactionListPage = () => {

    let [reactions, setReactions] = useState([])
    let [results, setResults] = useState([])
    let [ordering, setOrdering] = useState('')
    let [cardView, setCardView] = useState(false)
    let [pageCount, setPageCount] = useState(1)
    let [limit, setLimit] = useState(6)

    let getReactions = async () => {
        let response = await fetch(`/api/?limit=${limit}&ordering=${ordering}`)
        let data = await response.json()
        setReactions(data.results)
        const totalCount = data.count
        setPageCount(Math.ceil(totalCount / limit))
        setResults(data)
    }

    useEffect(() => {
        getReactions()
    }, [ordering, limit])

    useEffect(() => {
    }, [cardView])

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        let newReactionsFromServer = await getPaginatedReactions(currentPage);
        setReactions(newReactionsFromServer)
        window.scrollTo(0, document.body.scrollHeight)
    }

    const getPaginatedReactions = async (currentPage) => {
        let offset = ( currentPage - 1 ) * limit
        let response = await fetch(`/api/?limit=${limit}&offset=${offset}&ordering=${ordering}`)
        let data = await response.json()
        setResults(data)
        return data.results
    }

  return (
    <>
        <Container className='mb-4 mt-4'>
            <Row as="h4" className='mt-3 mb-3'> Reactions Table </Row>
            <Row className='mt-3'> This is a table containing all reactions in the database. </Row>
            <Row className='mt-3 align-items-center'> Order results by: 
                <div style={{width:300}}>
                    <select 
                        onChange={(e)=>setOrdering(e.target.value)} className="form-select">
                        <option value="id">Database ID (default)</option>
                        <option value="-internal_percent&internal_incorporation=Y">Internal incorporation %</option>
                        <option value="-n_term_percent&n_term_incorporation=Y">N-terminal incorporation %</option>
                        <option value="-assay__acylation_yield&synthetase__isnull=true">Microhelix assay acylation yield</option>
                    </select>
                </div>
                <Col>
                    <div>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="View structures"
                            onClick={() => {setCardView(!cardView)}} >
                        </Form.Check>
                    </div>
                </Col>
            </Row>
            <Row className='mt-3 align-items-center'> 
                <div style={{width:300, padding:0}}>
                    Number of results: {results?.count} 
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

            <Row className='mt-4'>
                <ReactionOrStructureList 
                    reactions={reactions} 
                    cardView={cardView} 
                    verbose={false} />
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
        </Container>
    </>
  );
}

export default ReactionListPage