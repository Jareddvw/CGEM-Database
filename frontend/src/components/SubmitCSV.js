import React, { useContext } from 'react'
import { useRef, useState } from 'react';
import { parse } from 'papaparse';
import { Form, ProgressBar, Spinner } from 'react-bootstrap';
import { createBrowserHistory } from 'history'
import AuthContext from '../context/AuthContext';
import AlertModal from './rxn_page_components/AlertModal';
import ReactionList from './list_components/ReactionList';
import StructureList from './list_components/StructureList';

const SubmitCSV = () => {
    const [fileName, setFileName] = useState(null);
    // data to be passed to ReactionList to display certain contents to user. Reformatted data from postData.
    const [displayedData, setDisplayedData] = useState([])
    // full data to actually be sent to server in a POST request. Consists of reformatted data from CSV.
    const [postData, setPostData] = useState([])
    // destination for file upload
    const inputRef = useRef(null);
    let history = createBrowserHistory()
    let { authTokens, user } = useContext(AuthContext)
    // check if all POST requests are successful.
    let [postError, setPostError] = useState([false, 'message'])
    let [postErrorHeader, setPostErrorHeader] = useState("")
    let [postSuccess, setPostSuccess] = useState([false, 'message'])
    // check if data is formatted correctly when user submits a CSV. formatError[1] gives the error message.
    let [formatError, setFormatError] = useState([false, 'message'])
    let [cardView, setCardView] = useState(false)
    let [loading, setLoading] = useState(false)
    let [currRow, setCurrRow] = useState(0)

    const handleUpload = () => {
        inputRef.current?.click();
    }

    const resetFileInput = () => {
        // reset file input value
        setDisplayedData([])
        setPostData([])
        inputRef.current.value = null;
      };

    const handleFileDetails = () => {
        if (inputRef.current?.files) {
            setFileName(inputRef.current.files[0].name);
            
            let arr = Array.from(inputRef.current.files)
                .filter((file) => file.type === "text/csv")
            
            getContents(arr[0])
        }
    }

    const getContents = async (file) => {
        const text = await file.text()
        const parsedText = parse(text, {header: true})

        // get the list of full objects to be sent as a POST request.
        let result = reformatData(parsedText.data)
        if (!result) {
            return;
        }
        
        // get the list of objects in a format to be displayed as a table to the user.
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

    const handleSubmit = async () => {
        setLoading(true)
        let currentRow = 1
        for (const reaction of postData) {
            currentRow += 1
            setCurrRow(currentRow)
            let response;
            // if user is admin, they can submit reactions directly. Otherwise, they POST data to reaction drafts instead.
            if (user.is_admin) {
                response = await fetch('/api/single/', {
                    method: 'post',
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization':'Bearer ' + String(authTokens.access)
                    },
                    body: JSON.stringify(reaction)
                })
            } else {
                response = await fetch('/api/drafts/', {
                    method: 'post',
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization':'Bearer ' + String(authTokens.access)
                    },
                    body: JSON.stringify({'reactionDraft': reaction, 'truncatedReactionDraft': displayedData[currentRow - 2]})
                })
            }
            if (!response.ok) {
                setPostError([true, `Error submitting data from row ${currentRow}. ` +
                            `Any rows prior to row ${currentRow} were submitted successfully. ` +
                            `Please double-check your data including and following row ${currentRow}, and resubmit those rows.`])
                setPostErrorHeader(`Error message at row ${currentRow}: ${await response.text()}`)
                setLoading(false)
                return;
            }
        }
        setLoading(false)
        setPostSuccess([true, `Successfully submitted all reactions${user.is_admin ? "!" : " to reaction-drafts!"}`])
        setCurrRow(0)
        return;
    }

    const reformatData = (parsedData) => {
        const result = []
        for (const entry of parsedData) {
            try {
            // checking that all required columns are present in the parsed data.
            if (!("DOI (required)" in entry &&
                "Monomer SMILES (required)" in entry && 
                "tRNA name (required)" in entry &&
                "tRNA sequence (required)" in entry && 
                "Ribosome name (required)" in entry)) {
                    setFormatError([true, 'CSV is missing a required column.'])
                return;
            }
            if ("Flexizyme name" in entry && "Synthetase common name" in entry) {
                setFormatError([true, 'Please submit separate files for synthetase and flexizyme reactions.'])
                return;
            }
            if (entry["Monomer SMILES (required)"].includes(".")) {
                setFormatError([true, "The monomer field should contain only 1 molecule per entry. " +
                    "There should be no periods in the Monomer SMILES parameter."])
                return;
            }
            if ((parseFloat(entry["Assay acylation yield"]) || 0) > 2 ||
                (parseFloat(entry["N-terminal incorporation"]) || 0) > 2 ||
                (parseFloat(entry["Internal incorporation"]) || 0) > 2) {
                setFormatError([true, "Percentages should be expressed as decimal numbers between 0 and 1."])
                return;
            }

            let newEntry = {}
            if ("Flexizyme name" in entry) {
                newEntry["synthetase"] = null
                newEntry["flexizyme"] = {"flex_name": entry["Flexizyme name"]}
                newEntry["assay"] = {
                    "conditions": entry["Assay conditions"],
                    "acylation_yield": parseFloat(entry["Assay acylation yield"]) || null,
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
                "monomer_smiles": entry["Monomer SMILES (required)"].split(".")[0],
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
                newEntry["n_term_incorporation"] = 
                    (newEntry["n_term_percent"] ? "Y" : 
                    (entry["N-terminal incorporation"] === "Yes" || entry["N-terminal incorporation"] === "Y") ? "Y" :
                    (entry["N-terminal incorporation"] === "No" || entry["N-terminal incorporation"] === "N") ? "N" : "");
            } catch {
                newEntry["n_term_percent"] = null
                newEntry["n_term_incorporation"] = 
                    (newEntry["n_term_percent"] ? "Y" : 
                    (entry["N-terminal incorporation"] === "Yes" || entry["N-terminal incorporation"] === "Y") ? "Y" :
                    (entry["N-terminal incorporation"] === "No" || entry["N-terminal incorporation"] === "N") ? "N" : "");
            }

            try {
                newEntry["internal_percent"] = parseFloat(entry["Internal incorporation"])
                newEntry["internal_incorporation"] =
                    (newEntry["internal_percent"] ? "Y" : 
                    (entry["Internal incorporation"] === "Yes" || entry["Internal incorporation"] === "Y") ? "Y" :
                    (entry["Internal incorporation"] === "No" || entry["Internal incorporation"] === "N") ? "N" : "");
            } catch {
                newEntry["internal_percent"] = null
                newEntry["internal_incorporation"] = 
                    (newEntry["internal_percent"] ? "Y" : 
                    (entry["Internal incorporation"] === "Yes" || entry["Internal incorporation"] === "Y") ? "Y" :
                    (entry["Internal incorporation"] === "No" || entry["Internal incorporation"] === "N") ? "N" : "");
            }
            newEntry["ribosome_name"] = entry["Ribosome name (required)"]
            newEntry["rib_readout"] = entry["Readout"]
            newEntry["rib_incorporation_notes"] = entry["Ribosomal incorporation notes"]
            
            result.push(newEntry)
            } catch (err) {
                setFormatError([true, err.message]);
                console.log(err)
                return;
            }
        }
        // result will only be returned if all data was correctly parsed and reformatted to be posted.
        return result;
    }
    
    return (
        <>
            <div className="m-3 mb-4 mt-3 align-items-center">
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
                    (fileName && inputRef.current?.files[0]?.type === "text/csv") ? "primary" : "secondary" }`
                }
                    onClick={handleSubmit}
                    disabled = {!(fileName && inputRef.current?.files[0]?.type === "text/csv")}
                >
                    Submit
                </button>
                <Form.Check
                    style={{width:200}}
                    className='mx-4'
                    inline
                    type="switch"
                    id="custom-switch"
                    label="View structures"
                    onClick={() => {setCardView(!cardView)}} >
                </Form.Check>
                {currRow !== 0 ? <ProgressBar now={currRow} role="status" variant="success" /> : <></>}
            </div>
            <AlertModal 
                headerText = "Error formatting data for submission."
                bodyText = {formatError[1]}
                show={formatError[0] === true ? true : false} 
                onHide={() => {
                    resetFileInput();
                    setFormatError([false, 'message'])
                }} 
            />
            <AlertModal 
                headerText = {postErrorHeader}
                bodyText = {postError[1]}
                show={postError[0] === true ? true : false} 
                onHide={() => {
                    resetFileInput();
                    setPostError([false, 'message'])
                }} 
            />
            <AlertModal 
                headerText = "Submission successful."
                bodyText = {postSuccess[1]}
                show={postSuccess[0] === true ? true : false} 
                onHide={() => {
                    if (user.is_admin) {
                        history.push("/my-reactions")
                        window.location.reload()
                    } else {
                        history.push("/reaction-drafts")
                        window.location.reload()
                    }
                    // setPostSuccess([false, 'message'])
                }} 
            />
            {/* {displayedData !== [] ? (<StructureList reactions={(displayedData)} nolink={true} />) : (<></>)} */}
            {displayedData.length !== 0 ? 
                (cardView === true) ?
                    (<StructureList reactions={(displayedData)} 
                                    verbose={false} nolink={true} />) :
                    (<ReactionList
                        reactions={(displayedData)} 
                        verbose={false} nolink={true} />) : 
                (<></>)}
            {/* {postData.length !== 0 ? JSON.stringify(postData) + "2: " + JSON.stringify(displayedData) : <></>} */}
        </>
    )
}

export default SubmitCSV