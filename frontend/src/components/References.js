import ReferenceItem from './ReferenceItem'
import { Container } from 'react-bootstrap'

const References = ({ references }) => {
    if (references) {
        return (
            <>
                <Container className="mb-5">
                    <h6 className='mt-3 mb-3'> References: </h6>
                    {references.map((reference, index) => <ReferenceItem key={reference.id} 
                        number={index + 1} reference={reference} />)}
                    
                </Container>
            </>
        )
    }
    else {
        return (<><h6> No references recorded for this reaction. </h6></>)
    }
}

export default References