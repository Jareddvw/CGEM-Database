import { useMatch } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Container, Row, Form, Col } from 'react-bootstrap'
import ReactionOrStructureList from '../components/list_components/ReactionOrStructureList'
import ReactPaginate from 'react-paginate'

const GeneralSearch = () => {

    const match = useMatch({
        path: "/search/:id",
        strict: true,
        sensitive: true,
    });

    let searchTerm = match.params.id

    let [reactions, setReactions] = useState([])
    let [cardView, setCardView] = useState(false)
    let [resultCount, setResultCount] = useState(0)
    let [limit, setLimit] = useState(6)
    let [pageCount, setPageCount] = useState(0)

    useEffect(() => {
        getReactions()
    }, [limit])

    let getReactions = async () => {
        if (searchTerm) {
            if (searchTerm.charAt(searchTerm.length - 1) === '?'){
                searchTerm.slice(0, -1)
            }
            let response = await fetch(`/api/?limit=${limit}&search=${searchTerm}`)
            let data = await response.json()
            const totalCount = data.count
            setPageCount(Math.ceil(totalCount / limit))
            setResultCount(totalCount)
            setReactions(data.results) 
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
        let response = await fetch(`/api/?limit=${limit}&offset=${offset}&search=${searchTerm}`)
        let data = await response.json()
        return data.results
    }
    
    if (searchTerm) {
        return (
            <Container>
                <Row className = 'mb-4 mt-5'><h4 className='text-center'>Search Results for "{searchTerm}": </h4></Row>
                <Row className = 'mb-4 mt-4 align-items-center'>
                    <div style={{padding:0, width:'200px'}}>
                        Number of results: {resultCount} 
                    </div>
                    <Form.Check
                        style={{width:200}}
                        className='mx-4'
                        inline
                        type="switch"
                        id="custom-switch"
                        label="View structures"
                        onClick={() => {setCardView(!cardView)}} >
                    </Form.Check>
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
                <ReactionOrStructureList cardView={cardView} reactions={reactions} verbose={false} />
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
          );
    } else {
        return (
            <></>
        )
    }
}

export default GeneralSearch