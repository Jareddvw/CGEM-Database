import React from 'react'
import { Link } from 'react-router-dom'


//version of ReactionListItem component which uses reaction object from api/single/ 
// call to api rather than just api/. This may be slower but gets more information.
const ReactionLI2 = ({ reaction }) => {
  return (
    <tr className="text-center">
        <td> 
            <Link to={`/reaction/${reaction.id}`} className="Link" style={{textDecoration: 'none', color: 'maroon'}} target="_blank"> 
            {reaction.monomer.monomer_name || reaction.monomer.monomer_smiles} 
            </Link>
        </td>
        <td> {reaction.flexizyme?.flex_name} </td>
        <td> {reaction.synthetase?.synth_common_name} </td>
        <td> {reaction.n_term_percent || reaction.n_term_incorporation || 'not recorded'} </td>
        <td> {reaction.internal_percent || reaction.internal_incorporation || 'not recorded'} </td>
        <td> {(reaction.assay?.acylation_yield !== undefined && reaction.assay?.acylation_yield !== null) ? 
              (reaction.assay.acylation_yield) : 
              ((reaction.flexizyme != null) ?
                   "not measured" :
                    "" )} </td>
    </tr>
  );
}

export default ReactionLI2