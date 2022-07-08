import React, { useContext } from 'react'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import BulkApproveModal from '../components/BulkApproveModal'
import BulkDeleteModal from '../components/BulkDeleteModal'
import ReactionOrStructureList from '../components/list_components/ReactionOrStructureList'
import AuthContext from '../context/AuthContext'

const ReactionDraftsPage = () => {
  
    let [truncatedReactions, setTruncatedReactions] = useState([])
    let [results, setResults] = useState([])
    let [cardView, setCardView] = useState(false)
    let [pageCount, setPageCount] = useState(1)
    let [limit, setLimit] = useState(12)
    let [loading, setLoading] = useState(true)

    let [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false)
    let [showDeleteModal, setShowDeleteModal] = useState(false)
    let [showApproveModal, setShowApproveModal] = useState(false)

    let {authTokens, user} = useContext(AuthContext)

    let getReactions = async () => {
        setLoading(true)
        let data;
        let truncRxns = []
        try {
            let response = await fetch(`/api/drafts/?limit=${limit}`)
            data = await response.json()
            console.log(data)
            for (const rxnDraft of data.results) {
                rxnDraft.truncatedReactionDraft.id = rxnDraft.id
                truncRxns.push(rxnDraft.truncatedReactionDraft)
            }
        } catch {
            setLoading(false)
        }
        console.log(truncRxns)
        setTruncatedReactions(truncRxns)
        const totalCount = data.count
        setPageCount(Math.ceil(totalCount / limit))
        setResults(data)
        setLoading(false)
    }

    useEffect(() => {
        getReactions()
    }, [limit])

    useEffect(() => {
    }, [cardView])

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        let newReactionsFromServer = await getPaginatedReactions(currentPage);
        setTruncatedReactions(newReactionsFromServer)
        window.scrollTo(0, document.body.scrollHeight)
    }

    const getPaginatedReactions = async (currentPage) => {
        let offset = ( currentPage - 1 ) * limit
        let response = await fetch(`/api/drafts/?limit=${limit}&offset=${offset}`)
        let data = await response.json()
        let truncRxns = []
        for (const rxnDraft of data.results) {
            rxnDraft.truncatedReactionDraft.id = rxnDraft.id
            truncRxns.push(rxnDraft.truncatedReactionDraft)
        }
        return truncRxns
    }

  return (
    <>
        <Container className='mb-4 mt-4'>
            <Row as="h4" className='mt-3 mb-3'> Reaction Drafts </Row>
            <Row className='mt-3'> The following reactions were added by unverified users, and have not yet been verified by an admin user. </Row>
            <Row className='mt-3 align-items-center'>
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
                <div style={{width:300, padding:0}}>
                    Number of results: {results?.count} 
                </div>
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

            {loading === true ? (<Row className="align-items-center justify-content-center mt-5"> <Spinner animation="border" className="mx-3"/>Waiting for data to load... </Row>) :
            (<>
            <Row className='mt-4'>
                <ReactionOrStructureList 
                    reactions={truncatedReactions} 
                    cardView={cardView} 
                    verbose={false} 
                    drafts={true} />
            </Row>
            </>)}
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

            {user !== null ?
                (<Row style={{justifyContent:'end', marginTop:'20px'}}>
                <button 
                    className="btn btn-outline-secondary mx-1" 
                    disabled={user === null}
                    style={{width:200}} 
                    onClick={() => {
                        setShowApproveModal(true)
                    }} >
                        Approve drafts
                </button>
                <button 
                    className="btn btn-outline-secondary mx-1" 
                    disabled={user === null}
                    style={{width:200}} 
                    onClick={() => {
                        setShowDeleteModal(true)
                    }} >
                        Delete drafts
                </button>
                <BulkApproveModal 
                    show={showApproveModal} 
                    onHide={() => setShowApproveModal(false)}
                    authTokens = {authTokens}
                    totalCount = {results?.count}
                />
                <BulkDeleteModal 
                    show={showDeleteModal} 
                    onHide={() => setShowDeleteModal(false)}
                    authTokens = {authTokens}
                    totalCount = {results?.count}
                />
                </Row>) : 
            <></>}
        </Container>
    </>
  );
}

export default ReactionDraftsPage