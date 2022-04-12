import React from 'react'
import { useRef, useState } from 'react';
import { parse } from 'papaparse';

const SubmitCSV = () => {
    const [fileName, setFileName] = useState(null);
    const inputRef = useRef(null);

    const handleUpload = () => {
        inputRef.current?.click();
    }

    const handleFileDetails = () => {
        if (inputRef.current?.files) {
            setFileName(inputRef.current.files[0].name);
            
            Array.from(inputRef.current.files)
                .filter((file) => file.type === "text/csv")
                .forEach( async (file) => {
                    const text = await file.text()
                    const result = parse(text, {header: true})
                    console.log(result)
            })
        }
    }

    const handleClick = () => {

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
                    onClick={handleClick}
                    disabled = {!(fileName && inputRef.current.files[0].type === "text/csv")}
                >
                    Submit
                </button>
            </div>
        </>
    )
}

export default SubmitCSV