import React from 'react'
import { useState, useEffect } from 'react'
import ListItem from '../components/ListItem'

import Table from 'react-bootstrap/Table'



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
    <div className="text-center">
        <div className = 'reaction-list'>
            <Table striped bordered hover size="sm" responsive="sm">
                <thead>
                    <tr>
                        <th>Name or SMILES</th>
                        <th>Flexizyme</th>
                        <th>Synthetase</th>
                        <th>N-terminal incorporation</th>
                        <th>Internal incorporation</th>
                        <th>Acylation yield</th>
                    </tr>
                </thead>
                <tbody>
                    {reactions.map((reaction, index) => (
                        <ListItem key = {index} reaction = {reaction} />
                    ))}
                </tbody>
            </Table>
        </div>
    </div>
  )
}

export default ReactionListPage