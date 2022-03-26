import React from 'react'
import SmilesDrawer from 'smiles-drawer'
import Canvas from './Canvas'

const MonomerDrawing = ({ smiles, width, height }) => {

    let drawTree = (current) => {
        let smilesDrawer = new SmilesDrawer.Drawer({ width: width, height: height})
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
            <Canvas draw={drawTree} width={width} height={height} />
        </>
      )

  return returnStatement
}

export default MonomerDrawing