import React from 'react'
import { CSVLink } from "react-csv"

const VerboseCSV = ( reactions ) => {

    const headers = [
      {label: "DOI", key: "DOI"},
      {label: "Flexizyme name", key: "flexizyme?.flex_name"},
      {label: "Flexizyme sequence", key:"flexizyme?.flex_seq"},
      {label: "Assay conditions", key: "assay?.conditions"},
      {label: "Assay acylation yield", key: "assay?.acylation_yield"},
      {label: "Acylation assay notes", key: "assay?.assay_notes"},
      {label: "Synthetase common name", key: "synthetase?.synth_common_name"},
      {label: "Parent synthetase", key: "synthetase?.parent_synthetase?.parent_name"},
      {label: "Accession ID", key: "synthetase?.accession_id"},
      {label: "Organism", key: "synthetase?.organisms"},
      {label: "Mutations", key: "synthetase?.mutations"},
      {label: "Crystal structure PDB code", key: "synthetase?.pbd_id"},
      {label: "Monomer name", key: "monomer.monomer_name"},
      {label: "Monomer SMILES", key: "monomer.monomer_smiles"},
      {label: "Monomer leaving group", key: "monomer.monomer_LG"},
      {label: "tRNA name", key: "tRNA.tRNA_name"},
      {label: "tRNA sequence", key: "tRNA.tRNA_seq"},
      {label: "Ribosome name", key: "ribosome_name"},
      {label: "N-terminal incorporation?", key: "n_term_incorporation"},
      {label: "N-terminal incorporation percent", key: "n_term_percent"},
      {label: "Internal incorporation?", key: "internal_incorporation"},
      {label: "Internal incorporation percent", key: "internal_percent"},
      {label: "Readout", key: "rib_readout"},
      {label: "Ribosomal incorporation notes", key: "rib_incorporation_notes"},
      {label: "Yield of reaction", key: "reaction_yield"},
      {label: "Km (mM)", key: "reaction_Km"},
      {label: "Kcat (min^-1)", key: "reaction_Kcat"},
      {label: "Notes", key: ""},
    ]

    let data = []
    reactions = reactions.reactions
    console.log(reactions)

    for (const reaction of reactions) {
      let muts = ""
      reaction.synthetase?.mutations?.map((mut) => {
        muts = muts + "; " + mut.mutation_name
      })
      if (reaction.synthetase) {
        reaction.synthetase["mutations"] = muts
      }

      let orgs = ""
      reaction.synthetase?.organisms?.map((org) => {
        orgs = orgs + "; " + org.organism_name
      })
      if (reaction.synthetase) {
        reaction.synthetase["organisms"] = orgs
      }
      data.push(reaction)
    }

  return (
    <> 
        <CSVLink
            headers={headers}
            data={data}
            filename="sleepytime.csv"
            target="_blank"
        >
          <button className="btn btn-outline-secondary">
            Download these results (CSV file)
          </button>
        </CSVLink>
    </>
  )
}

export default VerboseCSV