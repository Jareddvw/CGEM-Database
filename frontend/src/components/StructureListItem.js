import React from 'react'
import { Card, Overlay } from 'react-bootstrap'
import SmilesDrawer from 'smiles-drawer'
import { useEffect, componentDidMount } from 'react'

const StructureListItem = ({ smiles }) => {

    

    let drawTree = () => {
        let smilesDrawer = new SmilesDrawer.Drawer({ width: 350, height: 250})
        let input = document.getElementById({smiles})
        if (input != null) {
            SmilesDrawer.parse(smiles, function (tree) {
                smilesDrawer.draw(tree, input, 'light', false);
            }, function (err) {
                console.log(err);
            })
        }
    }

    useEffect(() => {
        drawTree()
    }, []);


  return (
    <>
        <Card style={{ width: '25rem' }}>
            <Card.Body>
                <canvas id={smiles}>
                </canvas>
            </Card.Body>
        </Card>
    </>
  )
}

export default StructureListItem