import React from 'react'
import {useState,useEffect} from 'react'
import { Link ,useParams,Navigate,useLocation} from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import axios from 'axios'
import logoutHandler from '../components/logout'

        


const ViewUser = () => {
    
  const [username, setUserName] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNo, setPhoneNo] = useState(" ")
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const role=localStorage.getItem("role")
  const authToken=localStorage.getItem("authToken")
  const {id}=useParams()
  let history=useLocation()

  useEffect(()=>{
    const config= {
        headers:{
            
            Authorization:`Bearer ${localStorage.getItem("authToken")}`,
            role:localStorage.getItem("role")
        }
   }
   
         axios.get('/api/auth/user' ,{ params: {id,config} })
        .then(res=>{
            setUserName(res.data.username)
            setEmail(res.data.email)
            setPhoneNo(res.data.phoneNo)
            setAddress(res.data.address)
        })
        .catch((err)=>{
          logoutHandler()
     }
     )
       
 

},[id]
)

  return (
    <>
    {authToken && role ?
    <FormContainer>
      <h1>USER DETAILS</h1>
      <Form  >
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          readOnly
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly
         ></Form.Control>
        </Form.Group>
        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            readOnly
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='phone'>
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type='number'
            placeholder='Enter Phone Number'
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            readOnly
          ></Form.Control>
        </Form.Group>
         <br/>
       
      </Form>

      
    </FormContainer>
:<Navigate to="/login"/>}</>
  )
}

export default ViewUser