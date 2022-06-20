import React, { useEffect } from 'react'
import { Form, Row } from 'react-bootstrap'
import { useState } from 'react'

const SearchFilter = ({ queries, setQueries, filterID, selected, setSelected }) => {
    // selected is a list of search filter terms currently open. 
    // Then need to just choose the next one in the filter terms list.

    // will construct entry to add to queries like {id__gte: 5} 
    // where term='id', operation='gte', and value={5}
    let [term, setTerm] = useState("id")
    let [operation, setOperation] = useState("exact")
    let [value, setValue] = useState('')
    let [leftSide, setLeftSide] = useState('')

    // whenever we change term, we need to 
    // update operation so it is valid for the given object 
    // for example you can use gte or lte on id, but not on reference DOI, so we need to catch that.
    useEffect(() => {
        setOperation(filterFields[term][0])
    }, [term])

    useEffect(() => {
        if (operation !== "exact") { 
            setLeftSide(term + "__" + operation)
        } else {
            setLeftSide(term)
        }
    }, [term, operation, value])

    // need to have an object that has keys for every different filter. Then combines each filter at end.
    useEffect(() => {
        let newQueries = {...queries}
        newQueries[`${filterID}`] = [`${leftSide}`, value]
        setQueries(newQueries);
    }, [leftSide, value])

    useEffect( () => () => console.log("unmount"), [] );

    // what we use to build queries
    let filterFields = {
        'n_term_percent': ['exact', 'gte', 'lte'],
        'internal_percent': ['exact', 'gte', 'lte'],
        'assay__acylation_yield': ['exact', 'gte', 'lte'],
        'flexizyme': ['isnull'],
        'flexizyme__flex_name': ['iexact', 'icontains'],
        'synthetase': ['isnull'],
        'synthetase__synth_common_name': ['iexact', 'icontains'],
        'synthetase__parent_synthetase__parent_name': ['iexact', 'icontains'],
        'synthetase__organisms__organism_name': ['iexact', 'icontains'],
        'synthetase__mutations__mutation_name': ['iexact', 'icontains'],
        'monomer__monomer_name': ['iexact', 'icontains'],
        'monomer__monomer_smiles': ['substruct'],
        'monomer__monomer_LG': ['iexact', 'icontains'],
        // date added is exact
        'date_added': ['exact'],
        'rib_readout': ['iexact', 'icontains'],
        'references__DOI': ['iexact', 'icontains'],
        // 'n_term_incorporation': ['iexact'],
        // 'internal_incorporation': ['iexact'],
        'rib_incorporation_notes': ['iexact', 'icontains'],
        'id': ['exact', 'gte', 'lte'],
    }

    // reformat filterFields so that already selected fields come last
    // let reformatFilters = () => {
    //     let sel=[]
    //     let selectedDict = {}
    //     for (const [key, value] in Object.entries(filterFields)) {
    //         if (sel.includes(key)) {
    //             selectedDict[key] = value
    //             delete filterFields[key]
    //         }
    //     }
    //     filterFields = {
    //         ...filterFields,
    //         ...selectedDict
    //     }
    // }

    // Object with actual query term: what the user sees for term names
    let filterKeyNames = {
        'n_term_percent':'n-terminal incorporation percent',
        'internal_percent':'internal incorporation percent',
        'assay__acylation_yield':'microhelix assay acylation yield',
        'flexizyme':'flexizyme',
        'flexizyme__flex_name':'flexizyme name',
        'synthetase':'synthetase',
        'synthetase__synth_common_name':'synthetase common name',
        'synthetase__parent_synthetase__parent_name':'parent synthetase name',
        'synthetase__organisms__organism_name':'organism name',
        'synthetase__mutations__mutation_name':'synthetase mutation name',
        'monomer__monomer_name':'monomer name',
        // this is monomer smiles
        'monomer__monomer_smiles':'substructure SMILES',
        'monomer__monomer_LG':'monomer leaving group',
        'date_added':'date added', // format is YYYY-MM-DD
        'rib_readout':'ribosomal readout',
        'references__DOI':'reference DOI',
        // 'n-terminal incorporation':'n_term_incorporation',
        // 'internal incorporation':'internal_incorporation',
        
        'rib_incorporation_notes':'ribosomal incorporation notes',
        'id':'reaction ID',
    }

    // let putUnselectedFirst = (dict) => {
    //     let selected = []
    //     for (const [key, value] in Object.entries(queries)) {
    //         if (value) {
    //             selected.push(value[0])
    //         }
    //     }
    //     let selectedDict = {}
    //     for (const [key, value] in Object.entries(dict)) {
    //         if (selected.includes(key)) {
    //             selectedDict[key] = value
    //             delete dict[key]
    //         }
    //     }
    //     dict = {
    //         ...dict,
    //         ...selectedDict
    //     }
    //     console.log(dict)
    //     return dict
    // }

    let newOperationName = (operation) => {
        if (term === "date_added") {
            return 'is exactly (YYYY-MM-DD)'
        }
        switch(operation) {
            case '':
                return 'is exactly'
            case 'iexact':
                return 'is exactly'
            case 'icontains':
                return 'contains'
            case 'gte':
                return 'is greater than or equal to'
            case 'lte':
                return 'is less than or equal to'
            case 'isnull':
                return 'true or false'
            case 'substruct':
                return 'is exactly'
            case 'exact':
                return 'is exactly'
            default:
                return operation
        }
    }
    // is null true or false should be reversed!

    // rotates array items by n and returns new array
    // let rotate = (arr1, n) => {
    //     let result = arr1.slice()
    //     for (let i=n; i > 0; i -= 1) {
    //         result.unshift(result.pop())
    //         console.log('result')
    //     }
    //     return result
    // }

    // let rotatedKeys = rotate(Object.keys(filterFields), parseInt(Object.keys(queries)[Object.keys(queries).length - 1]))

  return (
    <>
        <Form.Select 
            className='mt-3'
            size='md' 
            style={{width:325}}
            onChange={(e)=>setTerm(e.target.value)}
            >
                {Object.keys(filterFields).map((key) => (
                    <option key={key} value={key}>{filterKeyNames[key]}</option>))
                }
        </Form.Select>
        <Form.Select 
            className='mt-3'
            size='md' 
            style={{width:325}}
            onChange={(e)=> {
                setOperation(e.target.value); 
                operation !== "exact" ? 
                    setLeftSide(term + "__" + operation)
                    :
                    setLeftSide(term)
                }}>
                {filterFields[term].map((op, index) => (
                    <option key={index} value={op}>{newOperationName(op)}</option>))
                }
        </Form.Select>
        <Form.Control 
            className='mt-3'
            size='md' 
            style={{width:325 }}
            onChange={(e)=> {
                if (term === "synthetase" || term === "flexizyme") {
                    if (e.target.value === "true") {
                        setValue("false")
                    } else if (e.target.value === "false") {
                        setValue("true")
                    }
                }
                else if (term === "monomer__monomer_smiles" || term === "monomer__monomer_name") {
                    let queryString = e.target.value
                        if (queryString.length > 0) {
                            queryString = queryString.split('=').join('%3D')
                            queryString = queryString.split('#').join('%23')
                            queryString = queryString.split('(').join('%28')
                            queryString = queryString.split(')').join('%29')
                            queryString = queryString.split('+').join('%2B')
                            queryString = queryString.split('@').join('%40')
                        }
                    setValue(queryString)
                } else {
                    setValue(e.target.value)
                }
                operation !== "exact" ? 
                    setLeftSide(term + "__" + operation)
                    :
                    setLeftSide(term)
            }}
            >
        </Form.Control>
        {/* for debugging:
        {operation !== "" ? (term + "__" + operation + ": " + value) : (term + operation + ": " + value)}
        {leftSide} */}
    </>
  )
}

export default SearchFilter