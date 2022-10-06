import React,{useState} from 'react'
import FormContainer from '../components/FormContainer'
import { Card,Button,Form } from 'react-bootstrap'
import Message from '../components/Message'
import axios from 'axios'
import logoutHandler from '../components/logout'

        


const AddPortfolio = () => {
    const [symbol,setSymbol]=useState('')
    const [message,setMessage]=useState('')
    const id=localStorage.id
    let authToken=localStorage.authToken
const freeSpace=()=>{
    setSymbol('')
    setMessage('')
}
const onSubmit=async(e)=>{
    e.preventDefault()
    const config= {
      headers:{
          
          Authorization:`Bearer ${localStorage.getItem("authToken")}`,
          role:localStorage.getItem("role")
      }
 }
await axios.post('/api/addPortfolio',{id,symbol},{params:{config}})
.then((data)=>{
     setTimeout(()=>{
      freeSpace()
     },4000)
     return setMessage(data.data.message)
})
}
  return (
    <>{authToken &&
      <FormContainer md='12'>
                <Button onClick={()=>{window.location='portfolio'}} variant='primary'>
          Back
        </Button>
    <FormContainer>
        {message && <Message varient='success'>{message}</Message>}
        <Card className='my-3 p-5 rounded'>
      <Card.Body>          
        <Card.Title as='h3'>
            <strong>Add Symbol:</strong>
        </Card.Title>
        <Form onSubmit={onSubmit}>
     <Form.Control value={symbol} required placeholder='e.g IBM'
            onChange={(e) => setSymbol(e.target.value)}
             type="text"></Form.Control> 
      <br/>
    
        <Button type='submit' variant='primary'>
          Add TO Portfolio
        </Button>
        </Form>
          </Card.Body>
       
          </Card>
    </FormContainer></FormContainer>}
    </>
  )
}

export default AddPortfolio