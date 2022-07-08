import React, { useEffect, useRef } from 'react'
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

    useEffect(() => {
      if (loading === false) {
        csvLinkRef.current.link.click()
      }
    }, [loading])

    let finalReturnValue = (
      <>
        <CSVLink
            headers={headers}
            data={data}
            filename={`${name}.csv`}
            target="_blank"

            style={{width:'290px'}}
            ref={csvLinkRef}
        >
          <button className="btn btn-outline-secondary w-100">
            <span style={{marginRight:"10px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
              </svg>
            </span>
            Download all results (CSV)
          </button>
        </CSVLink>
      </>
    )


  if (loading === true) {
    return (
        <button className="btn btn-outline-success disabled" style={{width:'290px'}}>
          <span className="spinner-border spinner-border-sm" style={{marginRight:"10px"}} role="status" aria-hidden="true"></span>
          Download all results (CSV)
        </button>
    )
  } else {
    return finalReturnValue
  } 
}

export default VerboseCSV