import React from 'react'
import { Table } from 'react-bootstrap'

const RibosomeInfo = ({ reaction }) => {
  return (
      <>
        <Table size='sm' responsive='md' striped>
            <thead>
                <tr>
                    <th>Ribosome name</th>
                    <th>N-term incorporation</th>
                    <th>Internal incorporation</th>
                    <th>Readout</th>
                    <th>Yield</th>
                    <th>Kcat (min^-1)</th>
                    <th>Km (mM)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{reaction.ribosome_name}</td>
                    <td> {reaction.n_term_percent || reaction.n_term_incorporation || 'not recorded'} </td>
                    <td> {reaction.internal_percent || reaction.internal_incorporation || 'not recorded'} </td>
                    <td> {reaction.rib_readout} </td>
                    <td> {reaction.reaction_yield} </td>
                    <td> {reaction.reaction_Kcat} </td>
                    <td> {reaction.reaction_Km} </td>
                </tr>
            </tbody>
        </Table>
        <div>
            Ribosomal incorporation notes: {reaction.rib_incorporation_notes}
        </div>
      </>
    
)
}

export default RibosomeInfo