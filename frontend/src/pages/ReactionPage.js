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
    let [height, setHeight] = useState(150)
    let [loading, setLoading] = useState(true)
    let [serverError, setServerError] = useState(false)

    useEffect(() => {
        getReaction()
    }, [])

    useEffect(() => {
        if (reaction && Object.keys(reaction).length > 1) {
            setLoading(false)
        }
    }, [reaction])

    useEffect(() => {
        if (document.getElementById('figRow')) {
            const h = document.getElementById('figRow').clientHeight;
            setHeight(h - 50)
        }
    }, [loading])

    let getReaction = async () => {
        let response = await fetch(`/api/single/${id}`)
        let data = await response.json()
        if (response.status === 500) {
            console.log("Error connecting to server to fetch reaction" +
                        "info (server may not be running).") 
            setServerError(true)
        } else if (response.status === 404) {
            console.log("reaction not found.")
        } else {
            setReaction(data)
        }
    }

    if (!loading) {
   return (
    <Container className = "mb-3">
        <Row className="mt-4 mb-4"> 
            <h5 style={{color: "maroon"}}> 
                Reaction CGEM ID: {reaction?.id} 
            </h5>
        </Row>
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
       return <div className = "mt-5 text-center"> 
            <strong> 
                {(!serverError) ? "Wrong page! No data here..." :
                                "Waiting for reaction information to load..."}
            </strong> 
        </div>
   }
}

export default ReactionPage