import React from 'react'
import SmilesDrawer from 'smiles-drawer'

const MonomerDrawing = ({ smiles }) => {

    let smilesDrawer = new SmilesDrawer.Drawer({ width: 350, height: 250})
    let input = document.getElementById('drawing')
    if (input != null) {
        SmilesDrawer.parse(smiles, function (tree) {
            smilesDrawer.draw(tree, input, 'light', false);
        }, function (err) {
            console.log(err);
        })
    }

    let returnStatement = (
        <>
            <canvas id='drawing'>
            </canvas>
        </>
      )

  return returnStatement
}

export default MonomerDrawing