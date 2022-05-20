import React from 'react'
import { CSVLink } from "react-csv"

const DownloadCSV = ( reactions, filename ) => {

    const data=[
    ]

  return (
    <> 
        <CSVLink
            data={data}
            filename={filename}
            target="_blank"
        >
        Download these results (CSV file) 
        </CSVLink>
    </>
  )
}

export default DownloadCSV