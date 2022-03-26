import React from 'react'
import SmilesDrawer from 'smiles-drawer'
import Canvas from './Canvas'

const MonomerDrawing = ({ smiles }) => {

    let drawTree = (current) => {
        let smilesDrawer = new SmilesDrawer.Drawer({ width: 350, height: 250})
        if (current !== null && smiles) {
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

export default MonomerDrawing