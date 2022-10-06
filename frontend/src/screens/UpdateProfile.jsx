import React from 'react'
import {useState,useEffect} from 'react'
import { Link ,useParams,Navigate,useLocation} from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import axios from 'axios'
import logoutHandler from '../components/logout'


const UpdateProfile = () => {
    
  const [username, setUserName] = useState('')
  const [address, setAddress] = useState('')
  const [phoneNo, setPhoneNo] = useState('')
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
            setPhoneNo(res.data.phoneNo)
            setAddress(res.data.address)
        })
        .catch((err)=>{
          logoutHandler()
        })
       
 

},[id]
)
const onSubmit=async(e)=>
{
    e.preventDefault()
    const config= {
        headers:{
            
            Authorization:`Bearer ${localStorage.getItem("authToken")}`,
            role:localStorage.getItem("role")
        }
   }
    if(password){
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
      
      await axios.put(`/api/auth/updateProfile/${id}`,{id,password,username,address,phoneNo},{params:{config}})
      setTimeout(()=>{
          setMessage("")
          window.location=`/updateprofile/${id}`
          
          },4000)
          return setMessage("User Updated")
      
    } 
    else if(username !=='' || address !=='' || phoneNo!==''){
        await axios.put(`/api/auth/updateProfile/${id}`,{id,username,address,phoneNo},{params:{config}})
      .then(()=>{setTimeout(()=>{
          setMessage("")
          window.location=`/updateprofile/${id}`


          
          },4000)
          return setMessage("User Updated")})
      .catch((err)=>{
            logoutHandler()}
      )
      
    } 
}     

  return (
    <>
    {authToken && role ?
    <FormContainer>
      <h1>Update Profile</h1>
      {message && <Message variant='success'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      <Form onSubmit={onSubmit} >
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
            
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            
          ></Form.Control>
        </Form.Group>
         <br/>
        <Button type='submit' variant='primary'>
          Update
        </Button>
        
      </Form>

      
    </FormContainer>
:<Navigate to="/login"/>}</>
  )
}

export default UpdateProfile