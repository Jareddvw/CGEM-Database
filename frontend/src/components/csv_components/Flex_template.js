import React from 'react'
import { CSVLink } from 'react-csv'

const Flex_template = () => {

    const data = [
        [
            "DOI (required)",
            "Flexizyme name",
            "Monomer name",
            "Monomer SMILES (required)",
            "Monomer leaving group",
            "Assay conditions",
            "Assay acylation yield",
            "Acylation assay notes",
            "tRNA name (required)",
            "tRNA sequence (required)",
            "Ribosome name (required)",
            "N-terminal incorporation",
            "Internal incorporation",
            "Readout",
            "Ribosomal incorporation notes",
            "Notes"
        ],
        []
    ]

  return (
    <>
        <div>
            <CSVLink
                data={data}
                filename="CGEMDB_Flexizyme_submissions_blank.CSV"
                target="_blank"
                style={{textDecoration:"none"}}
            >
                <button className="btn btn-outline-secondary">
                    Download blank flexizymes template
                </button>
            </CSVLink>
        </div>
    </>
  )
}

export default Flex_template