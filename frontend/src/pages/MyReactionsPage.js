import React from 'react'
import ReactionOrStructureList from '../components/list_components/ReactionOrStructureList'
import { useState, useEffect, } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import ReactPaginate from 'react-paginate'

const MyReactionsPage = () => {

    let [reactions, setReactions] = useState([])
    let [ordering, setOrdering] = useState('')
    let [cardView, setCardView] = useState(false)
    let [resultCount, setResultCount] = useState(0)
    let [pageCount, setPageCount] = useState(1)
    let [limit, setLimit] = useState(6)

    let {authTokens, logoutUser, user} = useContext(AuthContext)

    useEffect(() => {
        getReactions()
    }, [ordering, limit])

    useEffect(() => {
    }, [cardView])

    let getReactions = async () => {
        let response = await fetch(`/api/myreactions/?limit=${limit}&ordering=${ordering}`,
        {
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            },
        }).catch((error) => {
            console.error(error);
            //go to some error page
        })
        let data = await response.json()

        console.log(data)
        if (response.ok) {
            setReactions(data.results)
            const totalCount = data.count
            setPageCount(Math.ceil(totalCount / limit))
            setResultCount(totalCount)
        } else if (response.statusText === 'Unauthorized') {
            logoutUser()
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
        let response = await fetch(`/api/?limit=${limit}&offset=${offset}&ordering=${ordering}`)
        let data = await response.json()
        return data.results
    }

  return (
    <>
        <Container className='mb-4 mt-4'>
            <Row className='mt-3' as="h4"> Your reactions: {user.username} </Row>
            <Row className='mt-3'> These are all of the reactions you have added. </Row>
            <Row className='mt-3 align-items-center'> Order results by: 
                <div style={{width:300}}>
                    <select 
                        onChange={(e)=>setOrdering(e.target.value)} 
                        onSubmit={(e)=>setOrdering(e.target.value)} className="form-select">
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
            <Row className='mt-4'>{reactions === [] ? <></> : <ReactionOrStructureList reactions={reactions} cardView={cardView} /> } </Row>
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

export default MyReactionsPage