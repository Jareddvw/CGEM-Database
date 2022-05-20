import React from 'react'
import { Table } from 'react-bootstrap'

const RibosomeInfo = ({ reaction }) => {

    let percent_or_YNA = (n_or_internal) => {
        
    }

  return (
      <>
        <Table size='sm' responsive='md' striped bordered>
            <thead>
                <tr>
                    <th>Ribosome name</th>
                    <th>N-term incorporation</th>
                    <th>Internal incorporation</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{reaction.ribosome_name}</td>
                    <td> {reaction.n_term_percent || reaction.n_term_incorporation || 'not recorded'} </td>
                    <td> {reaction.internal_percent || reaction.internal_incorporation || 'not recorded'} </td>
                </tr>
            </tbody>
        </Table>
        <div>
            <p>
                <span style={{fontWeight: 'bold'}}>Ribosomal incorporation notes: </span> 
                {reaction.rib_incorporation_notes || "None recorded."}
            </p>
        </div>
      </>
    
)
}

export default RibosomeInfo