import { Row } from 'react-bootstrap'
import { useState, useEffect } from 'react'

const AdvSearchPage = () => {

    let [query, setQuery] = useState({})


  return (
    <>
        <h4 className='mt-5 mb-3 text-center'>Advanced Reaction Search</h4>
        <Row></Row>
    </>
  )
}

export default AdvSearchPage