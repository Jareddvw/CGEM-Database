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
                <button className="btn btn-outline-secondary">
                    Download blank synthetases template
                </button>
            </CSVLink>
        </div>
    </>
  )
}

export default Synth_template