import React, { useContext } from 'react'
import { useRef, useState } from 'react';
import { parse } from 'papaparse';
import StructureList from './list_components/StructureList';
import ReactionList from './list_components/ReactionList';
import { createBrowserHistory } from 'history'
import AuthContext from '../context/AuthContext';

const SubmitCSV = () => {
    const [fileName, setFileName] = useState(null);
    const [displayedData, setDisplayedData] = useState([])
    const [postData, setPostData] = useState([])
    const inputRef = useRef(null);
    let history = createBrowserHistory()
    let {authTokens} = useContext(AuthContext)

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
        
        let displayedData = result.map((reaction) => {
            return {
                "flexizyme": ((reaction["flexizyme"] != null) ? reaction["flexizyme"]["flex_name"] : null),
                "synthetase": ((reaction["synthetase"] != null) ? reaction["synthetase"]["synth_common_name"] : null),
                "monomer": (reaction["monomer"]["monomer_smiles"] || reaction["monomer"]["monomer_name"]),
                "monomer_smiles": reaction["monomer"]["monomer_smiles"],
                "n_term_incorporation": reaction["n_term_incorporation"],
                "n_term_percent": reaction["n_term_percent"],
                "internal_incorporation": reaction["internal_incorporation"],
                "internal_percent": reaction["internal_percent"],
                "acylation_yield": reaction.assay?.acylation_yield || null
            }
        })
        setDisplayedData(displayedData)
        setPostData(result)
    }

    const handleSubmit = () => {
        for (const reaction of postData) {
            fetch('/api/single/', {
                method: 'post',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify(reaction)
            })
            .catch((error) => {
                console.error(error);
                //go to some error page
            })
        }
    }

    const reformatData = (parsedData) => {
        const result = []
        for (const entry of parsedData) {
            let newEntry = {}
            if ("Flexizyme name" in entry) {
                newEntry["synthetase"] = null
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
                    // need to change later, parent pbd id should have some way to be input
                    "parent_synthetase": {"parent_name": entry["Parent synthetase"], "parent_pbd_id": ""},
                    "accession_id": entry["Accession ID"],
                    "pbd_id": entry["Crystal structure PDB code"],
                    "organisms": entry["Organism"].split("; ").map((organism) => {
                        return {"organism_name": organism}
                    }),
                    "mutations": entry["Mutations"].split("; ").map((mutation) => {
                        return {"mutation_name": mutation}
                    })
                }
                newEntry["reaction_yield"] = parseFloat(entry["Yield of reaction"]) || null
                newEntry["reaction_Kcat"] = parseFloat(entry["Kcat (min^-1)"]) || null
                newEntry["reaction_Km"] = parseFloat(entry["Km (mM)"]) || null
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
                        "publication_date": null,
                        "journal": "",
                        "authors": null
            }})
            try {
                newEntry["n_term_percent"] = parseFloat(entry["N-terminal incorporation"])
                newEntry["n_term_incorporation"] = "Y"
            } catch {
                newEntry["n_term_percent"] = null
                newEntry["n_term_incorporation"] = entry["N-terminal incorporation"]
            }

            try {
                newEntry["internal_percent"] = parseFloat(entry["Internal incorporation"])
                newEntry["internal_incorporation"] = "Y"
            } catch {
                newEntry["internal_percent"] = null
                newEntry["internal_incorporation"] = entry["N-terminal incorporation"]
            }
            newEntry["ribosome_name"] = entry["Ribosome name (required)"]
            newEntry["rib_readout"] = entry["Readout"]
            newEntry["rib_incorporation_notes"] = entry["Ribosomal incorporation notes"]
            
            result.push(newEntry)
        }
        return result;
    }
    
    return (
        <>
            <div className="m-3 mb-4">
                <label className="mx-3">Choose file to upload:</label>
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
            {/* {displayedData !== [] ? (<StructureList reactions={(displayedData)} nolink={true} />) : (<></>)} */}
            {displayedData.length !== 0 ? (<ReactionList reactions={(displayedData)} />) : (<></>)}
            {/* {postData.length !== 0 ? JSON.stringify(postData) + "2: " + JSON.stringify(displayedData) : <></>} */}
        </>
    )
}

export default SubmitCSV