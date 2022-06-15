import React from 'react'

import ReactionListItem from './ReactionListItem'
import Table from 'react-bootstrap/Table'
import { Container } from 'react-bootstrap'
import ReactionLI2 from './ReactionLI2'


const ReactionList = ({ reactions, verbose, nolink }) => {
    
  return (
    <>
        <div className="text-center">
            <div className = 'reaction-list'>
                <Table striped bordered hover size="lg" responsive="md">
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
                        {(reactions) ? 
                            ((verbose === true) ?
                                (reactions.map((reaction, index) => (
                                    <ReactionLI2 key = {reaction.id || index} reaction = {reaction}/>))) :
                                (reactions.map((reaction, index) => (
                                    <ReactionListItem key = {reaction.id || index} reaction = {reaction} nolink={nolink}/>)))) : 
                            <></>}
                    </tbody>
                </Table>
            </div>
        </div>
    </>
  )
}

export default ReactionList