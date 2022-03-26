import { useRef } from 'react'
import { Card, Overlay, OverlayTrigger } from 'react-bootstrap'
import SmilesDrawer from 'smiles-drawer'
import Canvas from './Canvas'

const StructureListItem = ({ smiles, width, height }) => {

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
            <Card className="m-1" style={{width: 400}}>
                <Canvas draw={drawTree} width={width} height={height} />
            </Card>
        </>
      )

  return returnStatement
}

export default StructureListItem