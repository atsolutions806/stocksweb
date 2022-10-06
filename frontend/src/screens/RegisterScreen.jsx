import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import axios from 'axios'
const RegisterScreen = () => {
  const [username, setUserName] = useState(" ")
  const [address, setAddress] = useState(" ")
  const [phoneNo, setPhoneNo] = useState(" ")
  const [email, setEmail] = useState(" ")
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const role=localStorage.getItem("role")
  const authToken=localStorage.getItem("authToken")
  const freeSpace =()=>{
      setAddress('')
      setEmail('')
      setMessage('')
      setPassword('')
      setConfirmPassword('')
      setPhoneNo('')
      setUserName('')
  }


 

//  const redirect = location.search ? location.search.split('=')[1] : '/'

  // useEffect(() => {
  //   if (userInfo) {
  //     history.push(redirect)
  //   }
  // }, [history, userInfo, redirect])

  
  const onSubmit=async(e)=>
            {
                e.preventDefault()
                const config ={
                     header:{
                         "Content-Type":  "application/json"
                     }
                }
                  if (password.length <=3 ) {
                    setPassword('');
                    setTimeout(() => {
                      setError('');
                    }, 5000);
                    return setError(`Password is Too short`);
                  }
                  if (password !== confirmPassword) {
                    setPassword('');
                    setTimeout(() => {
                      setError('');
                    }, 5000);
                    return setError('Passwords do not match')
                  }
                const {data}=await axios.post("/api/auth/register",{username,email,password,address,phoneNo},config)    
                setTimeout(()=>{
                   
                   freeSpace() 
                    },4000)
                return window.location='/login'    
}     


  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant='info'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      
      <Form onSubmit={onSubmit}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

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
        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='phone'>
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type='number'
            placeholder='Enter Phone Number'
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        
        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
         <br/>
        <Button type='submit' variant='primary'>
          Register
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Have an Account?{' '}
          <Link to= '/login'>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
