import React ,{useState}from 'react'
import FormContainer from '../components/FormContainer'
import { Card ,DropdownButton,Dropdown,Form,Button} from 'react-bootstrap'
import Message from '../components/Message'
import axios from 'axios'
import logoutHandler from '../components/logout'

      
const AddAlert = () => {
    const [trend,setTrend]=useState('Trend Alert');
    const [change,setChange]=useState('Change To');
    const [symbol,setSymbol]=useState('');
    const [target,setTarget]=useState('');
    const [subject,setSubject]=useState('');
    const [note,setNote]=useState('');
    const [error,setError]=useState('');
    const [message,setMessage]=useState('');
    const id= localStorage.getItem("id")
    const freeSpace=()=>{
        setTrend('Trend Alert')
        setChange('Change To')
        setSymbol('')
        setTarget('')
        setSubject('')
        setNote('')
    }
  const handleTrendSelect=(e)=>{
    
    setTrend(e)
  }
  const handleChangeSelect=(e)=>{
    
    setChange(e)
  }
  const onSubmit=(e)=>{
    e.preventDefault()
    const config= {
      headers:{
          
          Authorization:`Bearer ${localStorage.getItem("authToken")}`,
          role:localStorage.getItem("role")
      }
 }
    if( trend !=='Trend Alert' && change !=='Change To'){
        const {data}=axios.post('/api/addAlert',{trend,change,symbol,target,subject,note,id},{params:{config}})
   .then((data)=>{
        setTimeout(()=>{
            setMessage('')
             freeSpace()
            },4000)
             setMessage(data.data.message)
          }  
      )
      .catch((err)=>{
        logoutHandler()
   }
   )

      
    }
    else{
        setTimeout(()=>{
            setError('')
          
            },4000)
             setError("Parameter Missing")
    }
    }

  return (
    <>
    <FormContainer xs='12' md='12' >
    <Card className='my-3 p-5 rounded'>
      <Card.Body>
          <Card.Title as='h3'>
            <strong>Add Alert:</strong>
          </Card.Title>
         {message && <Message variant="success" >{message}</Message>}
         {error && <Message variant="danger" >{error}</Message>}
    <Form onSubmit={onSubmit}>
    <div className='form-inline'>
         <Form.Control type='text' placeholder="symbol" value={symbol}
            onChange={(e) => setSymbol(e.target.value)} required
            ></Form.Control>&nbsp;
         <DropdownButton variant="success" id="dropdown-item-button" title={trend}  onSelect={handleTrendSelect}>
        <Dropdown.Item eventKey='Trend Alert'>Clear</Dropdown.Item>
        <Dropdown.Item eventKey="Add Price Alert">Add Price Alert</Dropdown.Item>
        <Dropdown.Item eventKey="Add Activity Alert">Add Activity Alert</Dropdown.Item>
      </DropdownButton>&nbsp;&nbsp;
      <DropdownButton variant="success" id="dropdown-item-button" title={change}  onSelect={handleChangeSelect}>
        <Dropdown.Item eventKey='Change To'>Clear</Dropdown.Item>
      <Dropdown.Item eventKey='above'>Above</Dropdown.Item>
      <Dropdown.Item eventKey="below">Below</Dropdown.Item>
      <Dropdown.Item eventKey="contains">Contains</Dropdown.Item>
    </DropdownButton>&nbsp;&nbsp;
    <Form.Control type='number'value={target} required
            onChange={(e) => setTarget(e.target.value)}
             placeholder="Target "></Form.Control>
        </div>
        <br/>
        <Form.Group>
    <Form.Label>Subject</Form.Label>
    <Form.Control type='text' value={subject} required
            onChange={(e) => setSubject(e.target.value)}
            ></Form.Control>
    </Form.Group>
    <Form.Group>
    <Form.Label>Note</Form.Label>
     <Form.Control value={note} required
            onChange={(e) => setNote(e.target.value)}
             as="textarea"rows="10"></Form.Control> 
     </Form.Group> <br/>
    
        <Button type='submit' variant='primary'>
          Add Alert
        </Button>
          
     </Form>
            </Card.Body>
    </Card>
   
    </FormContainer>
    </>
  )
}

export default AddAlert