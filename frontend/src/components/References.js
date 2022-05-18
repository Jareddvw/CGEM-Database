import ReferenceItem from './ReferenceItem'
import { Container } from 'react-bootstrap'

const References = ({ references }) => {
    if (references) {
        return (
            <>
                <h6 clfassName='mt-3 mb-3'> <strong>References: </strong></h6>
                <p></p>
                {references.map((reference, index) => <ReferenceItem key={reference.id} 
                    number={index + 1} reference={reference} />)}
                <p></p>
            </>
        )
    }
    else {
        return (<><h6> No references recorded for this reaction. </h6></>)
    }
}

export default References