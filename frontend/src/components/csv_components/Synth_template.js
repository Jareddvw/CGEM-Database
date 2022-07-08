import React from 'react'
import { CSVLink } from 'react-csv'

const Synth_template = () => {

    const data = [
        [
            "DOI (required)",
            "Synthetase common name",
            "Parent synthetase",
            "Accession ID",
            "Organism",
            "Mutations",
            "Crystal structure PDB code",
            "Monomer name",
            "Monomer SMILES (required)",
            "Monomer leaving group",
            "tRNA name (required)",
            "tRNA sequence (required)",
            "Ribosome name (required)",
            "N-terminal incorporation",
            "Internal incorporation",
            "Readout",
            "Ribosomal incorporation notes",
            "Yield of reaction",
            "Km (mM)",
            "Kcat (min^-1)",
            "Notes"
        ],
        []
    ]

  return (
    <>
        <div>
            <CSVLink
                data={data}
                filename="CGEMDB_Synthetase_submissions_blank.CSV"
                target="_blank"
                style={{textDecoration:"none"}}
            >
                <button className="btn btn-outline-secondary mt-1 mb-1">
                    <span style={{marginRight:"5px"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                        </svg>
                    </span>
                    Blank synthetase template
                </button>
            </CSVLink>
        </div>
    </>
  )
}

export default Synth_template