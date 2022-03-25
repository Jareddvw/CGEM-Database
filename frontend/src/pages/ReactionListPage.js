import React from 'react'
import { useState, useEffect } from 'react'
import ReactionList from '../components/ReactionList'

// Page for list of all reactions in database (different from search results page)

const ReactionListPage = () => {

    let [reactions, setReactions] = useState([])

    useEffect(() => {
        getReactions()
    }, [])

    let getReactions = async () => {

        let response = await fetch('/api/')
        let data = await response.json()
        setReactions(data.results) 

    }

  return (
    <>
        <ReactionList reactions={reactions} />
    </>
  );
}

export default ReactionListPage