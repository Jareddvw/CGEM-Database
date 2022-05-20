import { useState, useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import { Container, Table, Row, Card } from 'react-bootstrap'
import MonomerDrawing from '../components/MonomerDrawing'
import FlexOrSynthInfo from '../components/FlexOrSynthInfo'
import RibosomeInfo from '../components/RibosomeInfo'
import MicrohelixAssay from '../components/MicrohelixAssay'
import TRNA_info from '../components/TRNA_info'
import References from '../components/References'

const ReactionPage = () => {
    
    const match = useMatch({
        path: "/reaction/:id/",
        strict: true,
        sensitive: true,
      });

    const id = match.params.id

    let [reaction, setReaction] = useState({})
    let [height, setHeight] = useState(200)

    useEffect(() => {
        getReaction()
    }, [])

    useEffect(() => {
        const h = document.getElementById('figRow').clientHeight;
        setHeight(h)
    }, [])

    let getReaction = async () => {
        let response = await fetch(`/api/single/${id}`)
        let data = await response.json()
        setReaction(data)
    }

    if (reaction) {
   return (
    <Container className = "mb-3">
        <Row className="mt-4 mb-4"> <h5 style={{color: "maroon"}}> Reaction CGEM ID: {reaction?.id} </h5></Row>
        <Table responsive='sm' striped bordered>
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
        <Row id="figRow" className="figureRow">
            <Card className = "reactionPageCard" id = "rxnCard" style={{width: 400, height: '100%'}}>
                <Card.Header> <strong>Monomer Structure</strong></Card.Header>
                <Card.Body>
                    <MonomerDrawing smiles={reaction?.monomer?.monomer_smiles} width="350" height={height} />
                </Card.Body>
            </Card>
            <FlexOrSynthInfo synthetase={reaction?.synthetase} flexizyme={reaction?.flexizyme} readout={reaction?.rib_readout} />
            <TRNA_info tRNA={reaction?.tRNA} />
        </Row>
        <br />
            <MicrohelixAssay reaction={reaction} />
        <br />
        <div>
            <RibosomeInfo reaction={reaction} />
        </div>
        <div>
            <References references={reaction?.references} />
        </div>
    </Container>
  );
   } else {
       return <div> <strong> Waiting for reaction information to load... </strong> </div>
   }
}

export default ReactionPage