import React from 'react'
import { useState, useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import { Container, Table, Nav } from 'react-bootstrap'
import SmilesDrawer from 'smiles-drawer'

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

    let smilesDrawer = new SmilesDrawer.Drawer({ width: 350, height: 250, padding: 10 })
    let input = document.getElementById("drawing")
    let smiles = reaction?.monomer?.monomer_smiles
    if (input != null) {
        SmilesDrawer.parse(smiles, function (tree) {
            smilesDrawer.draw(tree, input, 'light', false);
        }, function (err) {
            console.log(err);
        })
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
        <div style={{color: 'maroon'}}>
            Monomer Structure:
        </div>
        <Nav>
            <canvas id="drawing">
            </canvas>
        </Nav>
        <div style={{color: 'maroon'}}>
            Flexizyme:
        </div>
    </Container>
  );
}

export default ReactionPage