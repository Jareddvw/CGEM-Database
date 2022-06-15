import React, { useEffect } from 'react'
import { Form, Row } from 'react-bootstrap'
import { useState } from 'react'

const SearchFilter = ({ queries, setQueries, filterID }) => {

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
        'id': ['exact', 'gte', 'lte'],
        'assay__acylation_yield': ['exact', 'gte', 'lte'],
        'flexizyme': ['isnull'],
        'flexizyme__flex_name': ['iexact', 'icontains'],
        'synthetase': ['isnull'],
        'synthetase__synth_common_name': ['iexact', 'icontains'],
        'synthetase__parent_synthetase__parent_name': ['iexact', 'icontains'],
        'synthetase__organisms__organism_name': ['iexact', 'icontains'],
        'synthetase__mutations__mutation_name': ['iexact', 'icontains'],
        'monomer__monomer_name': ['iexact', 'icontains'],
        'monomer__monomer_smiles': ['iexact', 'substruct'],
        'monomer__monomer_LG': ['iexact', 'icontains'],
        // date added is exact
        'date_added': ['exact'],
        'rib_readout': ['iexact', 'icontains'],
        'references__DOI': ['iexact'],
        // 'n_term_incorporation': ['iexact'],
        // 'internal_incorporation': ['iexact'],
        'n_term_percent': ['exact', 'gte', 'lte'],
        'internal_percent': ['exact', 'gte', 'lte'],
        'rib_incorporation_notes': ['iexact', 'icontains'],
    }

    // what the user sees for options
    let filterKeyNames = [
        'reaction id',
        'microhelix assay acylation yield',
        'flexizyme',
        'flexizyme name',
        'synthetase',
        'synthetase common name',
        'parent synthetase name',
        'organism name',
        'synthetase mutation name',
        'monomer name',
        // this is monomer smiles
        'monomer',
        'monomer leaving group',
        'date added', // format is YYYY-MM-DD
        'ribosomal readout',
        'reference DOI',
        // 'n_term_incorporation',
        // 'internal_incorporation',
        'n-terminal incorporation percent',
        'internal incorporation percent',
        'ribosomal incorporation notes'
    ]

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
                return 'is null (true or false)'
            case 'substruct':
                return 'has substructure:'
            case 'exact':
                return 'is exactly'
            default:
                return operation
        }
    }

  return (
    <>
        <Form.Select 
            className='mt-3'
            size='md' 
            style={{width:'28%'}}
            onChange={(e)=>setTerm(e.target.value)}
            >
                {Object.keys(filterFields).map((key, index) => (
                    <option key={key} value={key}>{filterKeyNames[index]}</option>))
                }
        </Form.Select>
        <Form.Select 
            className='mt-3'
            size='md' 
            style={{width:'28%'}}
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
            style={{width:'28%'}}
            onChange={(e)=> {
                if (term === "monomer__monomer_smiles") {
                    let queryString = e.target.value
                        if (queryString.length > 0) {
                            queryString = queryString.split('=').join('%3D')
                            queryString = queryString.split('#').join('%23')
                            queryString = queryString.split('(').join('%28')
                            queryString = queryString.split(')').join('%29')
                            queryString = queryString.split('+').join('%2B')
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