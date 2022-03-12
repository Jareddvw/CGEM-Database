import React from 'react'
import { useState, useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import { Container, Table, Row, Col } from 'react-bootstrap'
import MonomerDrawing from '../components/MonomerDrawing'
import FlexOrSynthInfo from '../components/FlexOrSynthInfo'
import RibosomeInfo from '../components/RibosomeInfo'
import MicrohelixAssay from '../components/MicrohelixAssay'
import TRNA_info from '../components/TRNA_info'

const ReactionPage = () => {

    const match = useMatch({
        path: "/reaction/:id/",
        strict: true,
        sensitive: true,
      });
    
    const id = match.params.id

    let [reaction, setReaction] = useState({})

    useEffect(() => {
        getReaction()
    }, [])

    let getReaction = async () => {

        let response = await fetch(`/api/single/${id}`)
        let data = await response.json()
        setReaction(data)

    }

   return (
    <Container>
        <br></br>
        <h5 style={{color: "maroon"}}> Reaction CGEM ID: {reaction?.id} </h5>
        <br></br>
        <Table responsive='sm' striped>
            <thead>
                <tr>
                    <th>Monomer Name</th>
                    <th>SMILES</th>
                    <th>Leaving Group</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{reaction?.monomer?.monomer_name}</td>
                    <td>{reaction?.monomer?.monomer_smiles}</td>
                    <td>{reaction?.monomer?.monomer_LG}</td>
                </tr>
            </tbody>
        </Table>
        <br></br>
        <Row>
            <MonomerDrawing smiles={reaction?.monomer?.monomer_smiles} />
            <FlexOrSynthInfo synthetase={reaction?.synthetase} flexizyme={reaction?.flexizyme} />
            <TRNA_info tRNA={reaction?.tRNA} />
        </Row>
        <br />
        <MicrohelixAssay reaction={reaction} />
        <br />
        <div>
            <RibosomeInfo reaction={reaction} />
        </div>
    </Container>
  );
}

export default ReactionPage