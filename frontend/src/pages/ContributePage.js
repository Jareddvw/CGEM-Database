import { Container, Row } from 'react-bootstrap'
import SubmitCSV from '../components/SubmitCSV'

const ContributePage = () => {
  return (
    <>
        <Container className='mb-5 mt-4'>
            <h4 className='mt-3 mb-3'> Contribute to the CGEM database </h4>
            <Row className='mb-3'> <p>Make sure every row of your submission has the following required fields: 
                <span style={{fontWeight: 'bold'}}> DOI, monomer SMILES, tRNA name, tRNA sequence, ribosome (name or WT)</span>.</p></Row>

            <SubmitCSV />
        </Container>
    </>
  )
}

export default ContributePage