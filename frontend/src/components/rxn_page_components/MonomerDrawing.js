import React from 'react'
import SmilesDrawer from 'smiles-drawer'
import Canvas from '../Canvas'
import { useState } from 'react'

const MonomerDrawing = ({ smiles, width, height }) => {

    let [error, setError] = useState(null)

    let drawTree = (current) => {
        console.log = () => {}
        let smilesDrawer = new SmilesDrawer.Drawer({ width: width, height: height})
        if (current !== null && smiles) {
            SmilesDrawer.parse(smiles, function (tree) {
                smilesDrawer.draw(tree, current, 'light', false);
                setError(null)
            }, function (err) {
                setError(1)
            })
        }
    }

    let drawing = (
        <Canvas draw={drawTree} width={width} height={height} />
    )

    let returnStatement = (
        <>
            {error === null ?
                <Canvas draw={drawTree} width={width} height={height} /> :
                <>
                    <Canvas draw={drawTree} width={0} height={0} />
                    <div className = "text-center mb-3"> Please enter a valid SMILES. </div>
                </>}
        </>
      )

  return returnStatement
}

export default MonomerDrawing