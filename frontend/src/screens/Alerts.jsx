import React,{useState,useEffect} from 'react'
import { Card,Button,Dropdown,Form,Table } from 'react-bootstrap' 
import axios from 'axios'
import logoutHandler from '../components/logout'

        

const Alerts = () => {
    let [search,setSearch]=useState('')
    let [data,setData]=useState([])
   const id=localStorage.getItem('id')
    const removeData=(id)=>{
        let flag= window.confirm("Delete  record!")
      if(flag)
      { const config= {
        headers:{
            
            Authorization:`Bearer ${localStorage.getItem("authToken")}`,
            role:localStorage.getItem("role")
        }
   }
         axios.delete(`/api/deleteAlert`, { params: {id,config} }) 
        .then(res => {
            window.location='/alerts'
           
        })
        
      }
    }
const submitHandler=(e)=>{
  e.preventDefault()
  const config= {
    headers:{
        
        Authorization:`Bearer ${localStorage.getItem("authToken")}`,
        role:localStorage.getItem("role")
    }
}
  if(search.startsWith('-')){
    axios.get('/api/alerts',{params:{id,config}})
    .then((data)=>{
      if(data[0]){
        setData(data.data)

      }     
            
        })
        .catch((err)=>{
          logoutHandler()
     }
     )
  }else{
  axios.get('/api/alerts',{params:{search,id,config}})
  .then((data)=>{
         setData(data.data)
          
      }).catch((err)=>{
        logoutHandler()
   }
   )
    }
}
useEffect(()=>{
  const config= {
    headers:{
        
        Authorization:`Bearer ${localStorage.getItem("authToken")}`,
        role:localStorage.getItem("role")
    }
}
  axios.get('/api/alerts',{params:{id,config}})
  .then((data)=>{
         setData(data.data)
          
      })
      .catch((err)=>{
        logoutHandler()
   }
   )
},[])

  return (
    <>  <div className='text-right'>
              <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        +  Add  Alerts
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="/alerts/addalert">Add Price Alert</Dropdown.Item>
        <Dropdown.Item href="/alerts/addalert">Add Activity Alert</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
</div>
    <Card className='my-3 p-3 rounded'>
      <Card.Body>
        
          <Card.Title as='h3'>
            <strong>Price Alerts</strong>
          </Card.Title> 
          Total Entries:{data.filter(item=>item.trend=='Add Price Alert').length}
          <div className='float-right'>
          <Form onSubmit={submitHandler} className='form-inline' >
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setSearch(e.target.value+'-Add Price Alert')}
        placeholder='Search ...'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2'>
      <i className='fas fa-search'></i> 
      </Button>
    </Form>
    </div>
            <Table striped bordered hover size='sm'>
      <thead>
        <tr>
          <th>Stock</th>
          <th>Alert </th>
          <th>Subject</th>
          <th>Note</th>
            </tr>
      </thead>
      <tbody>
      {data.filter(item=>item.trend=='Add Price Alert').map((item ) => {  
                            return <tr key={item._id}> 
                                <td>{item.symbol}</td> 
                                <td>{item.change}</td>  
                                <td>{item.subject}</td>  
                                <td>{item.note}</td>  
                                <td><Button variant='danger' className='btn-sm' onClick={() => removeData(item._id)}  >
                                    <i className='fas fa-trash'></i>
                                    </Button></td>
                                    </tr>
                        })}  
     
      </tbody>
    </Table>
            </Card.Body>
    </Card>
    <Card className='my-3 p-3 rounded'>
      <Card.Body>
        <div className='form-inline'>
          <Card.Title as='h3'>
            <strong>Activity Alerts</strong>
          </Card.Title> </div>
            Total Entries:{data.filter(item=>item.trend=='Add Activity Alert').length}<div className='float-right'>
            <Form onSubmit={submitHandler} className='form-inline' >
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setSearch(e.target.value+'-Add Activity Alert')}
        placeholder='Search ...'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2'>
      <i className='fas fa-search'></i> 
      </Button>
    </Form></div>
            

            <Table striped bordered hover size='sm'>
      <thead>
        <tr>
          <th>Stock</th>
          <th>Alert </th>
          <th>Subject</th>
          <th>Note</th>
            </tr>
      </thead>
      <tbody>
      {data.filter(item=>item.trend=='Add Activity Alert').map((item) => {  
                            return <tr key={item._id}> 
                                <td>{item.symbol}</td> 
                                <td>{item.change}</td>  
                                <td>{item.subject}</td>  
                                <td>{item.note}</td>  
                                <td><Button variant='danger' className='btn-sm' onClick={() => removeData(item._id)}  >
                                    <i className='fas fa-trash'></i>
                                    </Button></td>
                                    </tr>
                        })}  
     
      </tbody>
    </Table>
            </Card.Body>
    </Card>
    <Card className='my-3 p-3 rounded'>
      <Card.Body>
        <div className='form-inline'>
          <Card.Title as='h3'>
            <strong>Data Alerts</strong>
          </Card.Title> </div>
            Total Entries:{data.filter(item=>item.trend=='Add Data Alert').length}<div className='float-right'>
            <Form onSubmit={submitHandler} className='form-inline' >
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setSearch(e.target.value+'-Add Data Alert')}
        placeholder='Search ...'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2'>
      <i className='fas fa-search'></i> 
      </Button>
    </Form></div>

            <Table striped bordered hover size='sm'>
      <thead>
        <tr>
          <th>Stock</th>
          <th>Alert </th>
          <th>Subject</th>
          <th>Note</th>
            </tr>
      </thead>
      <tbody>
      {data.filter(item=>item.trend=='Add Data Alert').map((item) => {  
                            return <tr key={item._id}> 
                                <td>{item.symbol}</td> 
                                <td>{item.change}</td>  
                                <td>{item.subject}</td>  
                                <td>{item.note}</td>  
                                <td><Button variant='danger' className='btn-sm' onClick={() => removeData(item._id)}  >
                                    <i className='fas fa-trash'></i>
                                    </Button></td>
                                    </tr>
                        })}  
     
      </tbody>
    </Table>
            </Card.Body>
    </Card>
    <Card className='my-3 p-3 rounded'>
      <Card.Body>
        <div className='form-inline'>
          <Card.Title as='h3'>
            <strong>Custom RS Alerts</strong>
          </Card.Title>
        </div>
            Total Entries:{data.filter(item=>item.trend=='Add Custom RS Alert').length}<div className='float-right'>
            <Form onSubmit={submitHandler} className='form-inline' >
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setSearch(e.target.value+'-Add Custom RS Alert')}
        placeholder='Search ...'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2'>
      <i className='fas fa-search'></i> 
      </Button>
    </Form></div>

            <Table striped bordered hover size='sm'>
      <thead>
        <tr>
          <th>Stock</th>
          <th>Alert </th>
          <th>Subject</th>
          <th>Note</th>
            </tr>
      </thead>
      <tbody>
      {data.filter(item=>item.trend=='Add Custom RS Alert').map((item) => {  
                            return <tr key={item._id}> 
                                <td>{item.symbol}</td> 
                                <td>{item.change}</td>  
                                <td>{item.subject}</td>  
                                <td>{item.note}</td>  
                                <td><Button variant='danger' className='btn-sm' onClick={() => removeData(item._id)}  >
                                    <i className='fas fa-trash'></i>
                                    </Button></td>
                                    </tr>
                        })}  
     
      </tbody>
    </Table>
            </Card.Body>
    </Card>

    </>
 
  )
}

export default Alerts