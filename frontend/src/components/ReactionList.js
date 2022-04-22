import React from 'react'

import ReactionListItem from '../components/ReactionListItem'
import Table from 'react-bootstrap/Table'


const ReactionList = ({ reactions }) => {
    
  return (
    <>
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
                            <th>Acylation yield (flexizymes)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reactions.map((reaction) => (
                            <ReactionListItem key = {reaction.id} reaction = {reaction} />
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    </>
  )
}

export default ReactionList