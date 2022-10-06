import React ,{ useState,useEffect,useRef} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table,Button,Form} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import axios from 'axios';
import {Link} from 'react-router-dom'
import logoutHandler from '../components/logout'

       

const Users =()=>{
    let[gdata,setData] =useState([])
    let role=localStorage.getItem("role") 
    const [search,setSearch]=useState("")
    const [ employeeNo, setEmployeeNo] = useState('')
    const authToken=localStorage.getItem("authToken")
    let number=0
    const addNum=()=>{
      number=number+1
    }
    const fetchPrivateData=async(id,config)=>
    {
       
       
        await axios.delete(`/api/auth/user`, { params: {id,config} }) 
        .then(res => {
            const del = gdata.filter(gdata => id !== gdata._id)
            setData(del)
           
        })
        .catch((err)=>{
          logoutHandler()
     }
     )

    }
    const removeData = async(id) => {
        let flag= window.confirm("Delete  record!")
      if(flag)
      { 
        const config= {
            headers:{
                
                Authorization:`Bearer ${localStorage.getItem("authToken")}`,
                role:localStorage.getItem("role")
            }
       }
       
        
        fetchPrivateData(id,config)
       } 
    }
    
    

      
    useEffect(()=>{
        const config= {
            headers:{
                
                Authorization:`Bearer ${localStorage.getItem("authToken")}`,
                role:localStorage.getItem("role")
            }
       }
        async function fetchData(){   
            await axios.get('/api/auth/users', { params: {search,employeeNo,config} })
            .then(res=>{
                setData(res.data)

                
            })
            .catch((err)=>{
              logoutHandler()
         }
         )
           }
           
     fetchData()
     
    
    },[search,employeeNo]
    )
    return(
        <> 
        {role && authToken ?<div>    
           <div className='ml-auto'>
           <Form.Control  type="text" placeholder="Search by Name.." value={search} onChange={e=>setSearch(e.target.value)}/>
           &nbsp;<Form.Control type="number" placeholder="Search Employee #" value={employeeNo} onChange={ e => setEmployeeNo(e.target.value) } />
    </div>
    <br/>
           
           <Table striped bordered hover size='lg'>
      <thead>
        <tr>
          <th>#</th>
          <th>User #</th>
          <th> Name</th>
          <th>Email</th>
          <th>Phone #</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {gdata.map((item) => {  
                            return <tr key={item._id}> 
                                <td onClick={addNum()}>{number}</td>
                                <td>{item.employeeNo}</td> 
                                <td>{item.username}</td>  
                                <td>{item.email}</td>  
                                <td>{item.phoneNo}</td>  
                               <td > <LinkContainer to={`/admin/updateuser/${item._id}`}>
                    <Button variant='info' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer></td>
                  <td>
                  <Button
                  variant='danger'
                  className='btn-sm'
                  onClick={() => removeData(item._id)}
                >
                  <i className='fas fa-trash'></i>
                </Button></td>
                <td>
                 <LinkContainer  to={`/admin/viewuser/${item._id}`}>
                 <Button variant='success' className='btn-sm'>
                   <i className='fas fa-eye'></i>
                 </Button>
               </LinkContainer> 
               </td>
               </tr>
                        })}  
      </tbody>
    </Table>
    </div>
      :''} </>
    )
    
    }
    export default Users