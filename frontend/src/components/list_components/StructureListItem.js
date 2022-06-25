import { useRef } from 'react'
import { Card, Popover, Overlay, OverlayTrigger } from 'react-bootstrap'
import SmilesDrawer from 'smiles-drawer'
import Canvas from '../Canvas'
import { Link } from 'react-router-dom'

const StructureListItem = ({ id, smiles, width, height, name, 
    flexizyme, synthetase, acylation_yield, nolink, drafts }) => {

    let drawTree = (current) => {
        // get rid of console logs from within SmilesDrawer code
        console.log = () => {}
        let smilesDrawer = new SmilesDrawer.Drawer({ width: width, height: height})
        if (current !== null && smiles) {
            SmilesDrawer.parse(smiles, function (tree) {
                smilesDrawer.draw(tree, current, 'light', false);
            }, function (err) {
                console.log(err);
            })
        }
    }

    let cardHeight = height * 1.666
    let cardWidth = width * 1.2

    // const popover = (
    //     <Popover id="popover-basic">
    //       <Popover.Header as="h3">{name}</Popover.Header>
    //       <Popover.Body>
    //         <strong>{flexizyme || synthetase || 'chemical acylation'}</strong>
    //       </Popover.Body>
    //     </Popover>
    //   ); 

    const InnerCard = (
        <>
            <Card.Header>
                <strong>{name}</strong>
                <br></br>
                {flexizyme ? flexizyme + ". acylation yield: " + ((acylation_yield !== null) ? (acylation_yield) : "not measured")
                    : synthetase || 'chemical acylation'} 
                <br></br>
            </Card.Header>
            <Card.Body>
                <Canvas draw={drawTree} width={width} height={height} />
            </Card.Body> 
        </>);


    
    let returnStatement = (
            <>
                <Card className="m-1 hoverCard mb-3" style={{width: cardWidth, height: cardHeight}}>
                    {nolink === true ? 
                        InnerCard :
                        (<Link to={`/${drafts===true ? "reaction-drafts/" : "reaction/"}${id}`} className="Link" 
                            style={{textDecoration: 'none', color:'black'}}
                            target="_blank"> 
                        {InnerCard}
                        </Link>)
                    }
                    
                </Card>
            </>
        )

  return returnStatement
}

export default StructureListItem