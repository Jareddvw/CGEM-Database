import React, { useRef } from 'react'
import { CSVLink } from "react-csv"

// button to download all data from REACTIONS. CSV is downloaded on click.
const VerboseCSV = ( { reactions, name, loading } ) => {

    const headers = [
      {label: "id", key: "id"},
      {label: "DOI", key: "DOI"},
      {label: "Flexizyme name", key: "flexizyme.flex_name"},
      {label: "Flexizyme sequence", key:"flexizyme.flex_sequence"},
      {label: "Assay conditions", key: "assay.conditions"},
      {label: "Assay acylation yield", key: "assay.acylation_yield"},
      {label: "Acylation assay notes", key: "assay.assay_notes"},
      {label: "Synthetase common name", key: "synthetase.synth_common_name"},
      {label: "Parent synthetase", key: "synthetase.parent_synthetase.parent_name"},
      {label: "Accession ID", key: "synthetase.accession_id"},
      {label: "Organism", key: "synthetase.orgs"},
      {label: "Mutations", key: "synthetase.muts"},
      {label: "Crystal structure PDB code", key: "synthetase.pbd_id"},
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
    // console.log(reactions)

    for (const reaction of reactions) {
      if (reaction.synthetase) {
        let muts = ""
        if (reaction.synthetase.mutations) {
          for (const mut of reaction?.synthetase?.mutations) {
            muts += mut?.mutation_name + "; "
        } }
        reaction.synthetase["muts"] = muts
        let orgs = ""
        for (const org of reaction.synthetase.organisms) {
          orgs += org.organism_name + "; "
        }
        reaction.synthetase["orgs"] = orgs
      }

      let dois = ""
      for (const reference of reaction.references) {
        dois += reference.DOI + "; "
      }
      reaction["DOI"] = dois

      data.push(reaction)
    }

    const csvLinkRef = useRef()

    let finalReturnValue = (
      <>
        <CSVLink
            headers={headers}
            data={data}
            filename={`${name}.csv`}
            target="_blank"
            className="mt-1 mb-4 w-25"

            ref={csvLinkRef}
        >
          <button className="btn btn-outline-secondary w-100">
            <span style={{marginRight:"10px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
            </span>
            Download all results (CSV)
          </button>
        </CSVLink>
      </>
    )


  if (loading === true) {
    return (
        <button className={`w-25 mt-1 mb-4 btn btn-outline-secondary ${loading === true ? "disabled" : ""}`}>
          <span class="spinner-border spinner-border-sm" style={{marginRight:"10px"}} role="status" aria-hidden="true"></span>
          Download all results (CSV)
        </button>
    )
  } else {
    return finalReturnValue
  } 
}

export default VerboseCSV