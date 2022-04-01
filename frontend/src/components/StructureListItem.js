import { useRef } from 'react'
import { Card, Popover, Overlay, OverlayTrigger } from 'react-bootstrap'
import SmilesDrawer from 'smiles-drawer'
import Canvas from './Canvas'
import { Link } from 'react-router-dom'

const StructureListItem = ({ id, smiles, width, height, name, 
    flexizyme, synthetase, acylation_yield }) => {

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

    const popover = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">{name}</Popover.Header>
          <Popover.Body>
            <strong>{flexizyme || synthetase || 'chemical acylation'}</strong>
          </Popover.Body>
        </Popover>
      ); 

    let returnStatement = (
    <>
        <Card className="m-1 hoverCard mb-3" style={{width: 400, height:350}}>
            <Link to={`/reaction/${id}`} className="Link" style={{textDecoration: 'none', color:'black'}}> 
                <Card.Header>
                    <strong>{name}</strong>
                <br></br>
                {flexizyme ? flexizyme + ". acylation yield: " + (acylation_yield || 'not measured')
                    : synthetase || 'chemical acylation'} 
                <br></br>

                </Card.Header>
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