import { Container, Row } from 'react-bootstrap'
import SubmitCSV from '../components/SubmitCSV'

const ContributePage = () => {
  return (
    <>
        <Container className='mb-5'>
            <h4 className='mt-3 mb-3'> Contribute to the CGEM database </h4>
            <Row className='mb-3'>Make sure every row of your submission has the following required fields: 
                DOI, monomer SMILES, tRNA name, tRNA sequence, ribosome (name or WT).</Row>

            <SubmitCSV />
        </Container>
    </>
  )
}

export default ContributePage