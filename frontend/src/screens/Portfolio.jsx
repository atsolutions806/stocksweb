import React ,{useState,useEffect} from 'react'
import FormContainer from '../components/FormContainer'
import { Table,Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Indicators from './Indicators'
import axios from 'axios'
import Loader from '../components/Loader'
import logoutHandler from '../components/logout'

        
const Portfolio = () => {
    let [ticker,setTicker]=useState([])
    const [stockStats,setStockStats]=useState([])
    const id= localStorage.getItem('id')
let index=-1
    useEffect(()=>{
      const config= {
        headers:{
            
            Authorization:`Bearer ${localStorage.getItem("authToken")}`,
            role:localStorage.getItem("role")
        }
   }
         axios.get('/api/findUserAlert',{params:{id,config}})
        .then((res)=>{
          res.data.map((item)=>{
          
          let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${item}&apikey=${process.env.API_KEY}`;
          
         axios.get(API_Call)
          .then((data)=>{
                   
                  setStockStats(state=>[...state,data.data['Time Series (Daily)']])
          })
           setTicker(res.data)
        })
      })
      .catch((err)=>{
        logoutHandler()
   }
   )

    },[])
    const remove=(ticker)=>{
      let flag= window.confirm("Delete  record!")
      if(flag)
      { const config= {
        headers:{
            
            Authorization:`Bearer ${localStorage.getItem("authToken")}`,
            role:localStorage.getItem("role")
        }
   }
        axios.delete(`/api/deletePortfolio`, { params: {ticker,id,config} }) 
      .then(res => {
         window.location='/portfolio'
      })
      .catch((err)=>{
        logoutHandler()
   }
   )

}
    }
 
    return (
      <>
          <h1>Portfolio</h1>
          <FormContainer md='12'>
            <div className='text-right'>
              <Link to='/addportfolio'>
            <i className="fa fa-plus-circle fa-2x" aria-hidden="true"></i>
            </Link>
            </div><br/>
              <Table bordered striped hover className='sm' >
              <thead>
              <tr><th>Ticker</th>
                <th>Trend</th>
                <th> Trade</th>
                <th>Daily Trade Range</th>
                <th>Volume Sentiment</th>
                <th>Volume Spike</th>
                <th> Sentiment</th>
                <th>Volatility</th>
                <th>Probable Future</th>
                <th>Remove</th></tr>
            </thead>
            <tbody>
            {ticker.map((item)=>{
                        index=index+1      
                  return   (<tr  key={item}> 
                            <td>{item}</td>
                          {stockStats[ticker.length-1] && <Indicators stockStats={stockStats[index]} />}
                            <td>
                              <Button
                              variant='danger'
                              className='btn-sm'
                              onClick={() => remove(item)}
                            ><i className='fas fa-trash'></i>
                            </Button></td>
                            </tr>)})}</tbody></Table>
          </FormContainer>
       </>
        )
   
  
 
}

export default Portfolio