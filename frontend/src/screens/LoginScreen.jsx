import React, { useState, useEffect } from 'react'
import { Link} from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import axios from 'axios'
const LoginScreen = ({history}) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
let role=localStorage.getItem("role")
let authToken=localStorage.getItem("authToken")

  useEffect(()=>{
    if(role==='admin' && authToken)
    {  
    window.location='/stocks'
    }
    else if(role==='user' && authToken)
    {
 window.location='/stocks'
    }
     
 },[])

   const loginHandler=async(e)=>
  {
      e.preventDefault()
      const config ={
              header:{
                  "Content-Type":  "application/json"
              }
      }
          try {
              const {data}= await axios.post("/api/auth/login",{email,password},config)
              if(data.token){localStorage.setItem("authToken",data.token)
              if(data.role == 'admin')
              {
                localStorage.setItem("role",data.role)
                localStorage.setItem("username",data.username)
                localStorage.setItem("id",data.id)
                   window.location='/stocks'
              }
              else if(data.role == 'user'){
                localStorage.setItem("role",data.role)
                localStorage.setItem("username",data.username)
                localStorage.setItem("id",data.id)
               window.location='/stocks'
              }
                 
            }
              
          } catch (error) {
              setError("Incorrect email or password")
              setTimeout(()=>{
              setError("")
              },5000)
          }
      }
  
  
  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant='danger'>{error}</Message>}
      <Form onSubmit={loginHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
<br/>
        <Button type='submit' variant='primary'>
          Sign In
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to= '/register'>
            Register
          </Link>
          
        </Col>
      </Row>
      <Row className='py-3'>
        <Col>
         
          <Link to= '/forgotpassword'>
            Forgot Password
          </Link>
          
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
