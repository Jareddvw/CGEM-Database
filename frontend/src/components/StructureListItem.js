import { useRef } from 'react'
import { Card, Overlay, OverlayTrigger } from 'react-bootstrap'
import SmilesDrawer from 'smiles-drawer'
import Canvas from './Canvas'
import { Link } from 'react-router-dom'

const StructureListItem = ({ id, smiles, width, height, name }) => {

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
        <Card className="m-1 hoverCard" style={{width: 300}}>
            <Link to={`/reaction/${id}`} className="Link m-1" style={{textDecoration: 'none', color:'black'}}> 
                <Card.Body>
                    <Canvas draw={drawTree} width={width} height={height} />
                </Card.Body>
            </Link>
        </Card>
    </>
      )

  return returnStatement
}

export default StructureListItem