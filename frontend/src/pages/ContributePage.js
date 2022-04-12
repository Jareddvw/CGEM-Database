import { Container, Row } from 'react-bootstrap'
import SubmitCSV from '../components/SubmitCSV'

const ContributePage = () => {
  return (
    <>
        <Container className='mb-5'>
            <h4 className='mt-3 mb-3'> Contribute to the CGEM database </h4>
            <Row className='mt-3 mb-3'> Want to submit reactions to the database? 
                You can contribute by submitting a CSV file. </Row>

            <SubmitCSV />
        </Container>
    </>
  )
}

export default ContributePage