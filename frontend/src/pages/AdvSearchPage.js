import { Container, Row, Col, Button, Form, Stack } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import ReactionList from '../components/list_components/ReactionList'
import StructureList from '../components/list_components/StructureList'
import ReactionOrStructureList from '../components/list_components/ReactionOrStructureList'
import VerboseCSV from '../components/csv_components/VerboseCSV'

const AdvSearchPage = () => {

  let [queries, setQueries] = useState("")
  let [search, setSearch] = useState("")
  let [ordering, setOrdering] = useState("?ordering=id")
  let [reactions, setReactions] = useState([])
  let [cardView, setCardView] = useState("false")


  // for /api/single, use setReactions(data)
  // for /api/, use setReactions(data.results)
  let getReactions = async () => {
    let response = await fetch('/api/single/' + ordering + queries + search)
    if (response.status === 500) {
        setReactions("serverError")
        return;
    }
    let data = await response.json()

    setReactions(data)
    let length = await data.length
    if (length === 0) {
        setReactions("blank")
    }
  }

  const handleEnterKeyPressed = (event) => {
    if (event.key === 'Enter') {
        getReactions()
    }
  }
  

  return (
    <>
        <Container onKeyPress={handleEnterKeyPressed}>
            <Row as="h4" className='mt-4 mb-3'>Advanced Reaction Search</Row>
            <Row className='mt-3'> This will return all reactions that meet the selected criteria 
            (every additional filter will be joined with an AND statement). For search filters, 
            only results which EXACTLY match the input will be included. 
            <p></p>Input to "Other search terms" does not need to be exact. 
            You can also use this field to search for mutations (e.g "Y271G L274M C313V") 
            or for multiple additional organisms.
            Empty fields will be ignored so you don’t need to fill in every box. </Row>
            <Row></Row>
            
            <Row className='mt-3'>            
            <Col className='mt-3'> Parent synthetase (if synthetase) 
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries(queries + "&synthetase__parent_synthetase__parent_name=" + e.target.value)} 
                        onSubmit={(e)=>setQueries(queries + "&synthetase__parent_synthetase__parent_name=" + e.target.value)} 
                        type="text" placeholder="" >
                    </Form.Control>
                </div>
            </Col>
            <Col className='mt-3'> Flexizyme name (if flexizyme) 
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries(queries + "&flexizyme__flex_name=" + e.target.value)} 
                        onSubmit={(e)=>setQueries(queries + "&flexizyme__flex_name=" + e.target.value)} 
                        type="text" placeholder="" >
                    </Form.Control>
                </div>
            </Col>
            <Col className='mt-3'> Monomer name
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries(queries + "&monomer__monomer_name=" + e.target.value)} 
                        onSubmit={(e)=>setQueries(queries + "&monomer__monomer_name=" + e.target.value)} 
                        type="text" placeholder="" >
                    </Form.Control>
                </div>
            </Col>
            <Col className='mt-3'> Monomer LG
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries(queries + "&monomer__monomer_LG=" + e.target.value)} 
                        onSubmit={(e)=>setQueries(queries + "&monomer__monomer_LG=" + e.target.value)} 
                        type="text" placeholder="" >
                    </Form.Control>
                </div>
            </Col>
            <Col className='mt-3'> Organisms (for synthetases)
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries(queries + "&synthetase__organisms__organism_name=" + e.target.value)} 
                        onSubmit={(e)=>setQueries(queries + "&synthetase__organisms__organism_name=" + e.target.value)} 
                        type="text" placeholder="" >
                    </Form.Control>
                </div>
            </Col>
            <Col className='mt-3'> Reference DOI 
                <div style={{width:300}}>
                    <Form.Control
                        onChange={(e)=>setQueries(queries + "&references__DOI=" + e.target.value)} 
                        onSubmit={(e)=>setQueries(queries + "&references__DOI=" + e.target.value)} 
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
                        onChange={(e)=>setOrdering("?ordering=" + e.target.value)} 
                        onSubmit={(e)=>setOrdering("?ordering=" + e.target.value)} className="form-select">
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
                        <option value="false">List View</option>
                        <option value="true">Card View</option>
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
                        <Row className="mt-3">
                            {<ReactionOrStructureList 
                                reactions={reactions} 
                                cardView={cardView} 
                                verbose={true}/>}
                        </Row>
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