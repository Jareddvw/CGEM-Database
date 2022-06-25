import { Container, Row } from 'react-bootstrap'
import Flex_template from '../components/csv_components/Flex_template'
import Synth_template from '../components/csv_components/Synth_template'
import SubmitCSV from '../components/SubmitCSV'

const ContributePage = () => {
  return (
    <>
        <Container className='mb-5 mt-4'>
            <h4 className='mt-3 mb-3'> Contribute to the CGEM database </h4>
            <Row className='mb-3'> <p>To submit new reactions, download 
                and edit the relevant template files so that your entries are in a usable format.
                If your data does not include flexizymes or synthetases, you can use either file. 
                Percentages should be expressed as decimal values between 0 and 1.
                For multiple mutations (or organisms) corresponding to the same synthetase, 
                separate each mutation with a semicolon.
                </p>
                <p>
                Confirm that every row of your submission has the following required fields: 
                <span style={{fontWeight: 'bold'}}> DOI, monomer SMILES, tRNA name, 
                tRNA sequence, ribosome (name or WT)</span>.
                </p>
                <p>
                  If you are not authorized to submit data directly to the database reactions, 
                  please submit your reaction data as drafts instead.
                </p>
            </Row>
            <SubmitCSV />

            <Row className='mb-3' lg={5} md={3} sm={1}> 
              <Flex_template /> 
              <Synth_template />
            </Row>
        </Container>
    </>
  )
}

export default ContributePage