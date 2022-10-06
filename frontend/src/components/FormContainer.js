import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const FormContainer = ({ xs,md,children }) => {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={xs} md={md}>
          {children}
        </Col>
      </Row>
    </Container>
  )
}
FormContainer.defaultProps = {
  xs: 12,
  md:6
}

export default FormContainer
