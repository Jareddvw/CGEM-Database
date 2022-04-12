import React from 'react'
import { useRef, useState } from 'react';
import { parse } from 'papaparse';
import ReactionList from './ReactionList';

const SubmitCSV = () => {
    const [fileName, setFileName] = useState(null);
    const [fileData, setFileData] = useState([])
    const inputRef = useRef(null);

    const handleUpload = () => {
        inputRef.current?.click();
    }

    const handleFileDetails = () => {
        if (inputRef.current?.files) {
            setFileName(inputRef.current.files[0].name);
            
            let arr = Array.from(inputRef.current.files)
                .filter((file) => file.type === "text/csv")
            
            contents(arr[0])
        }
    }

    const contents = async (file) => {
        const text = await file.text()
        const parsedText = parse(text, {header: true})
        let result = reformatData(parsedText.data)
        result = result.map((reaction) => (JSON.stringify(reaction)))
        setFileData(result)
    }

    const handleSubmit = () => {
    }

    const reformatData = (parsedData) => {
        const result = []
        for (const entry of parsedData) {
            let newEntry = {}
            if ("Flexizyme name" in entry) {
                newEntry["flexizyme"] = {"flex_name": entry["Flexizyme name"]}
                newEntry["assay"] = {
                    "conditions": entry["Assay conditions"],
                    "acylation_yield": parseFloat(entry["Assay acylation yield"]),
                    "assay_notes": entry["Acylation assay notes"]
                }
            } else if ("Synthetase common name" in entry) {
                newEntry["flexizyme"] = null
                newEntry["assay"] = null
                newEntry["synthetase"] = {
                    "synth_common_name": entry["Synthetase common name"],
                    "parent_synthetase": entry["Parent synthetase"],
                    "accession_id": entry["Accession ID"],
                    "pbd_id": entry["Crystal structure PDB code"],
                    "organisms": entry["Organism"].split("; ").map((organism) => {
                        return {"organism_name": organism}
                    }),
                    "mutations": entry["Mutations"].split("; ").map((mutation) => {
                        return {"mutation_name": mutation}
                    })
                }
                newEntry["reaction_yield"] = entry["Yield of reaction"]
                newEntry["reaction_Kcat"] = entry["Kcat (min^-1)"]
                newEntry["reaction_Km"] = entry["Km (mM)"]
            } else {
                newEntry["flexizyme"] = null
                newEntry["assay"] = null
                newEntry["synthetase"] = null
            }
            newEntry["monomer"] = {
                "monomer_smiles": entry["Monomer SMILES (required)"],
                "monomer_name": entry["Monomer name"],
                "monomer_LG": entry["Monomer leaving group"]
            }
            newEntry["tRNA"] = {
                "tRNA_name": entry["tRNA name (required)"],
                "tRNA_seq": entry["tRNA sequence (required)"]
            }
            newEntry["references"] = 
                entry["DOI (required)"].split("; ").map( (DOI) => {
                    return {
                        "DOI": DOI,
                        "title": "",
                        "publication_date": "",
                        "journal": "",
                        "authors": null
            }})
            newEntry["ribosome_name"] = entry["Ribosome name (required)"]
            
            result.push(newEntry)
        }
        return result;
    }
    
    return (
        <>
            <div className="m-3">
                <label className="mx-3">Choose file:</label>
                <input
                    ref={inputRef}
                    onChange={handleFileDetails}
                    className="d-none"
                    type="file"
                />
                <button
                    onClick={handleUpload}
                    className={`mx-3 btn btn-outline-${
                        fileName ? "success" : "primary" }`
                    }
                >
                    {fileName ? fileName : "Upload CSV"}
                </button>

                <button className={`btn btn-outline-${
                    (fileName && inputRef.current.files[0].type === "text/csv") ? "primary" : "secondary" }`
                }
                    onClick={handleSubmit}
                    disabled = {!(fileName && inputRef.current.files[0].type === "text/csv")}
                >
                    Submit
                </button>
            </div>
            {fileData != [] ? (<ReactionList reactions={(fileData)} />) : (<></>)}
        </>
    )
}

export default SubmitCSV