import React, { useState, useEffect } from 'react'
import { Link} from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import axios from 'axios'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
const forgotPasswordHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      await axios.post('/api/auth/forgotpassword',{ email });

      setMessage("Reset Successfully ");
      setTimeout(() => {
        setMessage('');
      }, 5000);
    } catch (error) {
      setError('Email Not Registered');
      setEmail('');
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };
  
   
  
  
  return (
    <FormContainer>
      <h1>Forgot Password</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {message && <Message variant='danger'>{message}</Message>}
      <Form onSubmit={forgotPasswordHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

<br/>
        <Button type='submit' variant='primary'>
          Reset
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Have Account?{' '}
          <Link to= '/login'>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default ForgotPassword
