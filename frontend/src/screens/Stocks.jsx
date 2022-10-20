import React ,{useState,useEffect} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import logoutHandler from '../components/logout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button, NavDropdown,Table} from 'react-bootstrap'
import TableStyles from '../assets/table.css'
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';

const Stocks =()=>{
  
  let {ticker}=useParams()

  let [column1 ,setColumn1]=useState([]) ;let [column2 ,setColumn2]=useState([]); let [column3 ,setColumn3]=useState([]);let [column4 ,setColumn4]=useState([]);let [column5 ,setColumn5]=useState([]);let [column6 ,setColumn6]=useState([]);let [column7 ,setColumn7]=useState([]);let [column8 ,setColumn8]=useState([]);
  let [column14 ,setColumn14]=useState([]);let [column15 ,setColumn15]=useState([]);let [column12 ,setColumn12]=useState([]);let [column13 ,setColumn13]=useState([]);let [column16 ,setColumn16]=useState([]);let [column17 ,setColumn17]=useState([]);let [column18 ,setColumn18]=useState([]);let [column19 ,setColumn19]=useState([]);
  let [column20 ,setColumn20]=useState([]);let [column21 ,setColumn21]=useState([]);
  let [column9 ,setColumn9]=useState([]);let [column10 ,setColumn10]=useState([]);let [column11 ,setColumn11]=useState([]); let [column22 ,setColumn22]=useState([]);let [column23 ,setColumn23]=useState([]);let [column24 ,setColumn24]=useState([]);let [column25 ,setColumn25]=useState([]);let [column26 ,setColumn26]=useState([]);
  const [data,setData]=useState([])
  const [priceFormat1,setPriceFormat]=useState([])
  const [volumeFormat1,setVolumeFormat]=useState([])
  const [volatilityFormat1,setVolatilityFormat]=useState([])
  let [range,setRange]=useState(5)  
  const date=new Date()
  const fdate=date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+('0'+(date.getDate())).slice(-2)
 //const date=new Date().toLocaleDateString('en-CA')
 const tdate=(date.getFullYear()-1)+'-'+('0'+(date.getMonth()-1)).slice(-2)+'-'+('0'+date.getDate()).slice(-2)  
   let [error1,setError1]=useState('')
   let [error2,setError2]=useState('')
   
   useEffect(()=>{
    const config= {
        headers:{
            
            Authorization:`Bearer ${localStorage.getItem("authToken")}`,
            role:localStorage.getItem("role")
        }
   }
    let id=localStorage.id
    axios.get('/api/auth/user',{ params: {id,config} },)
        .then(res=>{
           console.log('yes')
        })
        .catch((err)=>{
             logoutHandler()
        }
        )
       

},[])
 
  useEffect(()=>{
    
 if (!ticker)
 {ticker='ibm'}
    axios.get('/api/getStockData',{params:{ticker,tdate,fdate}})
        .then(res=>{
           
           setData(res.data.dataOfGraph)
           setColumn1(res.data.column1)
           setColumn2(res.data.column2)
           setColumn3(res.data.column3)
           setColumn4(res.data.column4)
           setColumn5(res.data.column5)
           setColumn6(res.data.column6)
           setColumn7(res.data.column7)
           setColumn8(res.data.column8)
           setColumn9(res.data.column9)
           setColumn10(res.data.column10)
           setColumn11(res.data.column11)
           setColumn12(res.data.column12)
           setColumn13(res.data.column13)
           setColumn14(res.data.column14)
           setColumn15(res.data.column15)
           setColumn16(res.data.column16)
           setColumn17(res.data.column17)
           setColumn18(res.data.column18)
           setColumn19(res.data.column19)
           setColumn20(res.data.column20)
           setColumn21(res.data.column21)
           setColumn22(res.data.column22)
           setColumn23(res.data.column23)
           setColumn24(res.data.column24)
           setColumn25(res.data.column25)
           setColumn26(res.data.column26)
           setPriceFormat(res.data.priceFormat)
           setVolumeFormat(res.data.volumeFormat)
           setVolatilityFormat(res.data.volatilityFormat)
        })
        .catch((err)=>{
             
        }
        )
       

},[]
)

 
const vix=()=>{window.location='/stocks/VIX'}
const tnx=()=>{window.location='/stocks/TNX'}
const uup=()=>{window.location='/stocks/UUP'}
const btc=()=>{window.location='/stocks/BTC'}

  
 


  return(
    <> 
   
 {data ? <div>
        <div className='w-50'>
        <Button  variant='outline-primary' className='rounded-pill' onClick={vix}>VIX</Button>&nbsp;&nbsp;
        <Button  variant='outline-primary' className='rounded-pill'onClick={tnx}>TNX</Button>&nbsp;&nbsp;
        <Button  variant='outline-primary' className='rounded-pill'onClick={uup}>UUP</Button>&nbsp;&nbsp;
       <Button  variant='outline-primary' className='rounded-pill' onClick={btc}>BTC</Button>&nbsp;&nbsp;
      
        </div>
        <div className='text-right'>
       
        <NavDropdown title="size" >
        <NavDropdown.Item>
                 {range*10}%
    <input
            type="range"
            value={range}
            min={1}
            max={10}
            className='form-range'
            variant='success'
            step={1}
            onChange={e => setRange(e.target.value)}
     />
     </NavDropdown.Item>
                 </NavDropdown>
    
          </div>
        <FormContainer sx='12' md='12'> 
    <h1>{ticker ? ticker :'IBM'}</h1>
    
         
    {data[0] ? '':<Loader></Loader>}
    <LineChart
      width={range*100+500 || 1000}
      height={range*100+50 || 550}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis  dataKey="date" />
      <YAxis type="number" domain={[100000, 'dataMax + 10']} orientation='right'/>
      <Tooltip />
      <Legend />
    
       <Line type="monotone" dataKey="close" stroke="black"   dot={false} />
     <Line type="monotone" dataKey="bullishTop" stroke="purple" strokeDasharray="3 3" dot={false} />
     <Line type="monotone" dataKey="bullishBottom" stroke="red" strokeDasharray="3 3" dot={false}/>
          </LineChart>
    </FormContainer>
        <h3>Indicators</h3>
       <Table hover table-responsive-xl>
            <thead>
                <tr>
                    <th className="volume-spike" colSpan="1">Volume Spike</th>
                    <th className="price-head" colSpan="2">Price</th>
                    <th className="price-head" colSpan="2">Volume</th>
                    <th className="performance-head" colSpan="5">Performance</th>
                    <th className="trend-indicator" colSpan="2">Trend Indicator</th>
                    <th className="trade-signal" colSpan="4">Trade Signal</th>
                    <th className="volatility-indicator" colSpan="5">Volatility Indicators</th>
                </tr>
                <tr>
                    <th className="volume-spike">Spike</th>
                    <th className="yellow-head">Date</th>
                    <th className="yellow-head">Price</th>
                    <th className="yellow-head">Volume</th>
                    <th className="yellow-head">Volume Signal</th>
                    <th className="performance-subhead">1 Day % Chg</th>
                    <th className="performance-subhead">5 Day % Chg</th>
                    <th className="performance-subhead">1 Mo % Chg</th>
                    <th className="performance-subhead">3 Mo % Chg</th>
                    <th className="performance-subhead">6 Mo % Chg</th>
                    <th className="sentiment-head">Fast Sentiment</th>
                    <th className="sentiment-head">Slow Sentiment</th>
                    <th className="trade-signal-head">Bottom</th>
                    <th className="trade-signal-head">Top</th>
                    <th className="trade-signal-head">Bull</th>
                    <th className="trade-signal-head">Bear</th>
                    <th className="volatility-ind-head">Energy</th>
                    <th className="volatility-ind-head">Volatility</th>
                    <th className="volatility-ind-head">Volatility Trend</th>
                    <th className="volatility-ind-head">Correlation</th>
                    <th className="volatility-ind-head">Price Path</th>
                </tr>
            </thead>
            <tbody>
                {column2.map((entry, index) => {
                    let k=0
                    let next = index++;
                    const priceFormat = priceFormat1[index];
                    const volumeFormat = volumeFormat1[index];
                    const volatilityFormat = volatilityFormat1[index];
                    return (
                        <tr>
                            {column1[index] === true ? <td>Volume Spike</td> : <td> </td>}
                            <td>{column2[index]}</td>
                            <td className={priceFormat}>${parseFloat(column3[index])}</td>
                            <td className={volumeFormat}>${column22[index]}</td>
                            {column4[index] === 1 ? <td className="black-green">Volume Increasing</td> : column4[index] === 0 ? <td className="black-pink">Volume Falling</td> : <td></td>}
                            {column5[index] == undefined ? <td> </td> :column5[index] > 0 ? <td className='bullish-green'>{column5[index].toFixed(5)}%</td> : <td className='bearish-red'>{column5[index].toFixed(5)}%</td>}
                            {column6[index] == undefined ? <td> </td> :column6[index] > 0 ? <td className='bullish-green'>{column6[index].toFixed(5)}%</td> : <td className='bearish-red'>{column6[index].toFixed(5)}%</td>}
                            {column7[index] == undefined ? <td> </td> :column7[index] > 0  ? <td className='bullish-green'>{column7[index].toFixed(5)}%</td> : <td className='bearish-red'>{column7[index].toFixed(5)}%</td>}
                            {column8[index] == undefined ? <td> </td> :column8[index] > 0   ? <td className='bullish-green'>{column8[index].toFixed(5)}%</td> : <td className='bearish-red'>{column8[index].toFixed(5)}%</td>}
                            {column9[index] == undefined ? <td> </td> :column9[index] > 0  ? <td className='bullish-green'>{column9[index].toFixed(5)}%</td> : <td className='bearish-red'>{column9[index].toFixed(5)}%</td>}
                            {column10[index] == 1 ? <td className='bearish-red'>Bearish</td> : column10[index] == 0 ? <td className='bullish-green'>Bullish</td>: <td></td>}
                            {column11[index] == 1 ? <td className='bearish-red'>Bearish</td> : column11[index] == 0 ? <td className='bullish-green'>Bullish</td>: <td></td>}
                            {column10[index] == 1 ? <td>${column23[index]}</td> : column10[index] == 0 ? <td>${column24[index]}</td> : <td></td>}
                            {column10[index] == 1 ? <td>${column25[index]}</td> : column10[index] == 0 ? <td>${column26[index]}</td> : <td></td>}
                            {((column12[index] == column13[index]) && column12[index] > 0 && column13[index] > 0) ? <td className='bullish-green'>Go Long</td> : <td></td>}
                            {((column14[index] == column15[index]) && column14[index] > 0 && column15[index] > 0) ? <td className='bearish-red'>Go Short</td> : <td></td>}
                            {column16[index] == 1 ? <td className='bullish-green'>Rising Bull</td> : column16[index] == 0 ? <td className='bearish-red'>Falling Bear</td> : <td></td>}
                            <td className={volatilityFormat}>{column17[index] !== '' ? '$' + column17[index] : ''}</td>
                            {column18[index] == 1 ? <td className='bullish-green'>Volatility Rising</td> : column18[index] == 0 ? <td className='bearish-red'>Volatility Falling</td> : <td></td>}
                            {column19[index] < column20[index] ? <td className='bearish-red'>Falling Correlation</td> : column19[index] > column20[index] ? <td className='bullish-green'>Rising Correlation</td> : column19[index] == -1 && <td></td>}
                            {column21[index] == 1 ? <td className='bearish-red'>Price To Fall</td> : column21[index] == 0 ? <td className='bullish-green'>Price To Rise</td> : <td></td>}
                            
                        </tr>
                    )    
                })}
            </tbody>
        
        </Table>
        </div>:<div>
                    <h5>{error1 ? error1:<div> <h6>Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency</h6><br/><h5>Wait a minute</h5></div>}</h5>
                    <br/>
                    <h5>{error2} </h5>
              </div>}

  </>
 )
  
}



export default Stocks
