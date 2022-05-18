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

    useEffect(() => {
        getReaction()
    }, [])

    let getReaction = async () => {
        let response = await fetch(`/api/single/${id}`)
        let data = await response.json()
        setReaction(data)
    }

    if (reaction) {
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
        <Row className="figureRow">
            <Card className = "reactionPageCard" style={{width: 400}}>
                <Card.Header> <strong>Monomer</strong></Card.Header>
                <Card.Body>
                    <MonomerDrawing smiles={reaction?.monomer?.monomer_smiles} width="350" height="250" />
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