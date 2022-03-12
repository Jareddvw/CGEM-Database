import React from 'react'
import SmilesDrawer from 'smiles-drawer'

const MonomerDrawing = ({ smiles }) => {

    let smilesDrawer = new SmilesDrawer.Drawer({ width: 350, height: 250})
    let input = document.getElementById("drawing")
    if (input != null) {
        SmilesDrawer.parse(smiles, function (tree) {
            smilesDrawer.draw(tree, input, 'light', false);
        }, function (err) {
            console.log(err);
        })
    }

  return (
    <>
        <h6> Monomer Structure: </h6>
        <canvas id="drawing">
        </canvas>
    </>
  )
}

export default MonomerDrawing