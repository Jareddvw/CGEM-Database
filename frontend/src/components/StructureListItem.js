import React from 'react'
import { Card, Overlay } from 'react-bootstrap'
import SmilesDrawer from 'smiles-drawer'
import { useEffect, componentDidMount } from 'react'
import Canvas from './Canvas'

const StructureListItem = ({ smiles }) => {

    let drawTree = (current) => {
        let smilesDrawer = new SmilesDrawer.Drawer({ width: 350, height: 250})
        if (current !== null) {
            SmilesDrawer.parse(smiles, function (tree) {
                smilesDrawer.draw(tree, current, 'light', false);
            }, function (err) {
                console.log(err);
            })
        }
    }

  let returnStatement = (
    <>
        <Canvas draw={drawTree} />
    </>
  )

  return returnStatement
}

export default StructureListItem