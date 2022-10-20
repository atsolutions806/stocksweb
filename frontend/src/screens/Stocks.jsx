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
  
  const {ticker}=useParams()

  const [ stockStats, setStockStats ] = useState([])
  const [ sixMonthData, setSixMonthData ] = useState({})
  const [data,setData]=useState([])
  let [range,setRange]=useState(5)  
  const date=new Date()
  const fdate=date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+('0'+(date.getDate()-2)).slice(-2)
 //const date=new Date().toLocaleDateString('en-CA')
  const tdate=(date.getFullYear()-1)+'-'+('0'+(date.getMonth()-1)).slice(-2)+'-'+('0'+date.getDate()).slice(-2)  
  let pushData=[]
  let functionality='TIME_SERIES_DAILY'
   let [error1,setError1]=useState('')
   let [error2,setError2]=useState('')
   

   const setDataOfGraph=(sliced)=>{
    console.log(sliced)
    const generateSquare = (num) => {
        return num * num
    }
    const calculateMean = (position, numOfDays, value) => {
        let mean = 0;
    
        for(let index = position + 1; index < position + numOfDays + 1; index++) {
            const currentValue = Object.values(sliced)[index]
            const requiredValue = parseFloat(Object.values(currentValue)[value])
            mean += requiredValue
        }
    
        return (mean / numOfDays);
    }
    const calculateStandardDeviation = (position, numOfDays, value) => {
        const dataLength = Object.keys(sliced).length - position - 1
        if(dataLength >= numOfDays + 1) {
            const mean = calculateMean(position, numOfDays, value);
            let sumOfVariance = 0;
            
            for (let index = position + 1; index < position + numOfDays + 1; index++) {
                const currentValue = Object.values(sliced)[index]
                const requiredValue = parseFloat(Object.values(currentValue)[value])
                const variance = requiredValue - mean
                const squaredVariance = generateSquare(variance)
                sumOfVariance += squaredVariance
            }
    
            const quotient = sumOfVariance / (numOfDays - 1)
            return Math.sqrt(quotient)
        }
    }
    const calculateAverage = (position, days, value) => {
        let average = []
        for (let ind = position; ind < (position + days); ind++) {
            const currentValue = Object.values(sliced)[ind]
            const requiredValue = parseFloat(Object.values(currentValue)[value])
            average.push(requiredValue)
        }
        const closingAverage = average.reduce((a, b) => a + b, 0) / average.length;
        return closingAverage
    }
    
    
     const Bottom = (position) => {
         const dataLength = Object.keys(sliced).length - position - 1
         if(dataLength >= 21) {
             const standardDeviation = calculateStandardDeviation(position, 20, 3)
             const average = calculateAverage(position + 1, 20, 3)
             const buyBottom = average - standardDeviation
             return buyBottom.toFixed(2)
         }
     }
     
     const Top = (position) => {
         const dataLength = Object.keys(sliced).length - position - 1
         if(dataLength >= 21) {
             const standardDeviation = calculateStandardDeviation(position, 20, 3)
             const average = calculateAverage(position + 1, 20, 3)
             const sellTop = average + (3 * standardDeviation)
             return sellTop.toFixed(2)
         }
     }
         let num=0
       
         for (var key in sliced) {
     if((Top(num)!==undefined) && (Bottom(num)!==undefined) ){
            
        const obj={date:Object.values(sliced[key])[14].slice(0,10),close:Object.values(sliced[key])[3] ,bullishTop:Top(num)  ,bullishBottom:Bottom(num) }
        pushData.push(obj)
       }
        num=num+1
       }
       let revData=pushData.reverse()
        setData(revData)
    
   }
  useEffect(() => {
    if(ticker=='VIX'){                 
      const url = `https://api.marketstack.com/v1/eod?access_key=fbcc4d37fa291f8e8d972b26e005b880&symbols=uvxy&limit=400&date_from=${tdate}&date_to=${fdate}`
      const monthlyUrl =`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=UVXY&apikey=${process.env.API_KEY}`
      axios.get(monthlyUrl)                                 
      .then(res => {
        console.log(res.data)
    if(res.data){
        axios.get(url)
        .then(response => {
console.log(response.data)         
      
      if(response.data)
      {           
               setDataOfGraph(Object.values(response.data)[1])
               setStockStats(Object.values(response.data)[1])
               setSixMonthData(Object.values(res.data)[1])
            }
      
                     })
                     .catch(err => setError2( err))
  
        }
      })
      .catch(err => setError1( err))
    
               
    }
    else if(ticker=='TNX'){
      const url = `https://api.marketstack.com/v1/eod?access_key=fbcc4d37fa291f8e8d972b26e005b880&symbols=TBX&limit=400&date_from=${tdate}&date_to=${fdate}`
      const monthlyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=TBX&apikey=${process.env.API_KEY}`
      axios.get(monthlyUrl)                                 
      .then(res => {
        console.log(res.data)
    if(res.data){
        axios.get(url)
        .then(response => {
console.log(response.data)         
      
      if(response.data)
      {             
        
               setDataOfGraph(Object.values(response.data)[1])
               setStockStats(Object.values(response.data)[1])
               setSixMonthData(Object.values(res.data)[1])
            
            }
      
                     })
                     .catch(err => setError2( err))
     
        }
      })
      .catch(err => setError1( err))
    
     
    
                        }
    else if(ticker=='UUP'){
        
      const url = `https://api.marketstack.com/v1/eod?access_key=fbcc4d37fa291f8e8d972b26e005b880&symbols=uup&limit=400&date_from=${tdate}&date_to=${fdate}`
      const monthlyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${ticker}&apikey=${process.env.API_KEY}`
      axios.get(monthlyUrl)                                 
          .then(res => {
            console.log(res.data)
  if(res.data){
    axios.get(url)
    .then(response => {
        console.log(response.data)         

if(response.data)
{         
     setDataOfGraph(Object.values(response.data)[1])
     setStockStats(Object.values(response.data)[1])
     setSixMonthData(Object.values(res.data)[1])
    }

})
                 .catch(err => setError2( err))

            }
          })
          .catch(err => setError1( err))
  
      
                     
    }
    else if(ticker=='BTC'){
      const url = `https://api.marketstack.com/v1/eod?access_key=fbcc4d37fa291f8e8d972b26e005b880&symbols=btcusd&limit=400&date_from=${tdate}&date_to=${fdate}`
      const monthlyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=BTCUSD&apikey=${process.env.API_KEY}`
    axios.get(monthlyUrl)
        .then(res => {
          console.log(res.data)
if(res.data){
    axios.get(url)
    .then(response => {

if(response.data)
{   
console.log(response.data)         

     setDataOfGraph(Object.values(response.data)[1])
     setStockStats(Object.values(response.data)[1])
     setSixMonthData(Object.values(res.data)[1])
    }

                 })
                 .catch(err => setError2( err))

    }
        })
        .catch(err => setError1( err))

  
       
                     
     }
    
    else if(ticker){
        const url = `https://api.marketstack.com/v1/eod?access_key=fbcc4d37fa291f8e8d972b26e005b880&symbols=${ticker}&limit=400&date_from=${tdate}&date_to=${fdate}`
        const monthlyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${ticker}&apikey=${process.env.API_KEY}`
      axios.get(monthlyUrl)
          .then(res => {
            console.log(res.data)
  if(res.data){ axios.get(url)
    .then(response => {
        console.log(response.data)         

if(response.data)
{               
setStockStats(Object.values(response.data)[1])
setDataOfGraph(Object.values(response.data)[1])
setSixMonthData(Object.values(res.data)[1])
}

                 })
                 .catch(err => setError2( err))


           }
          })
          .catch(err => setError1( err))
  
                       
      
    }
    else{
     
    const url = `https://api.marketstack.com/v1/eod?access_key=fbcc4d37fa291f8e8d972b26e005b880&symbols=ibm&limit=400&date_from=${tdate}&date_to=${fdate}` 
    const monthlyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=${process.env.API_KEY}`
 

    axios.get(monthlyUrl)
          .then(res => {
              console.log(res)
            if(res.data){
            console.log(res.data)
            axios.get(url) .then(response => {
                console.log(response.data)
              
                        if(response.data){
                        setSixMonthData(Object.values(res.data)[1])
                        setStockStats(Object.values(response.data)[1])
                        setDataOfGraph(Object.values(response.data)[1])                    
                    }
                    })
                    .catch(err => setError1( err))
              
              
            
             
                      }
             })
            .catch(err => setError2( err))
    
    
            }
      }, [])
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
         
  
  },[]
  )


  const calculateStandardDeviation = (position, numOfDays, value) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= numOfDays + 1) {
        const mean = calculateMean(position, numOfDays, value);
        let sumOfVariance = 0;
        
        for (let index = position + 1; index < position + numOfDays + 1; index++) {
            const currentValue = Object.values(stockStats)[index]
            const requiredValue = parseFloat(Object.values(currentValue)[value])
            const variance = requiredValue - mean
            const squaredVariance = generateSquare(variance)
            sumOfVariance += squaredVariance
        }

        const quotient = sumOfVariance / (numOfDays - 1)
        return Math.sqrt(quotient)
    }
}

const calculateVolatilityStandardDeviation = (position, numOfDays) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= 41) {
        const mean = calculateVolatilityMean(position, numOfDays);
        let sumOfVariance = 0;
        
        for (let index = position + 1; index < position + numOfDays + 1; index++) {
            const requiredValue = calculateVolatility(index)
            const variance = requiredValue - mean
            const squaredVariance = generateSquare(variance)
            sumOfVariance += squaredVariance
        }

        const quotient = sumOfVariance / (numOfDays - 1)
        return Math.sqrt(quotient)
    }
}

const calculateMean = (position, numOfDays, value) => {
    let mean = 0;

    for(let index = position + 1; index < position + numOfDays + 1; index++) {
        const currentValue = Object.values(stockStats)[index]
        const requiredValue = parseFloat(Object.values(currentValue)[value])
        mean += requiredValue
    }

    return (mean / numOfDays);
}

const calculateVolatilityMean = (position, numOfDays) => {
    let mean = 0;

    for(let index = position + 1; index < position + numOfDays + 1; index++) {
        const requiredValue = calculateVolatility(index)
        mean += requiredValue
    }

    return (mean / numOfDays);
}

const generateSquare = (num) => {
    return num * num
}

const calculateBullishBuyBottom = (position) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= 21) {
        const standardDeviation = calculateStandardDeviation(position, 20, 3)
        const average = calculateAverage(position + 1, 20, 3)
        const buyBottom = average - standardDeviation
        return buyBottom.toFixed(2)
    }
}

const calculateBullishSellTop = (position) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= 21) {
        const standardDeviation = calculateStandardDeviation(position, 20, 3)
        const average = calculateAverage(position + 1, 20, 3)
        const sellTop = average + (3 * standardDeviation)
        return sellTop.toFixed(2)
    }
}

const calculateBearishBuyBottom = (position) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= 21) {
        const standardDeviation = calculateStandardDeviation(position, 20, 3)
        const average = calculateAverage(position + 1, 20, 3)
        const buyBottom = average - (3 * standardDeviation)
        return buyBottom.toFixed(2)
    }
}

const calculateBearishSellTop = (position) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= 21) {
        const standardDeviation = calculateStandardDeviation(position, 20, 3)
        const average = calculateAverage(position + 1, 20, 3)
        const sellTop = average + standardDeviation
        return sellTop.toFixed(2)
    }
}

const calculateDailyBullHigh = (position, days) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength < 21) {
        return -1
    }
    let highValues = []
    for (let ind = position + 1; ind < (position + days + 1); ind++) {
        const currentValue = Object.values(stockStats)[ind]
        currentValue === undefined ? highValues.push(0) : highValues.push(parseFloat(Object.values(currentValue)[1]))
    }
    
    return Math.max(...highValues)
}

const calculateDailyBullLow = (position, days) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength < 21) {
        return -1
    }
    let lowValues = []
    for (let ind = position + 1; ind < (position + days + 1); ind++) {
        const currentValue = Object.values(stockStats)[ind]
        currentValue === undefined ? lowValues.push(0) : lowValues.push(parseFloat(Object.values(currentValue)[2]))
    }

    return Math.min(...lowValues)
}

const calculateStockSentiment = (position, days) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= days + 1) {
        let sellingPressure = []
        let buyingPressure = []
        for (let ind = position + 1; ind < (position + days + 1); ind++) {
            const currentValue = Object.values(stockStats)[ind]
            const previousValue = Object.values(stockStats)[ind + 1]
            const sell = parseFloat(Object.values(currentValue)[2]) - parseFloat(Object.values(previousValue)[3])
            const buy = parseFloat(Object.values(currentValue)[1]) - parseFloat(Object.values(previousValue)[3])
             
            sell > 0 ? sellingPressure.push(sell) : sellingPressure.push(parseFloat(Object.values(previousValue)[3]) - parseFloat(Object.values(currentValue)[2]))
            buy > 0 ? buyingPressure.push(buy) : buyingPressure.push(parseFloat(Object.values(previousValue)[3]) - parseFloat(Object.values(currentValue)[1]))
            
        }
        
        const sellingAverage = sellingPressure.reduce((a, b) => a + b, 0) / sellingPressure.length;
        const buyingAverage = buyingPressure.reduce((a, b) => a + b, 0) / buyingPressure.length;
        if(sellingAverage > buyingAverage) {
            return 1
        }
        return 0    
    } else {
        return -1
    }   
}

const calculateStockVolumes = (position) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    const days = 16
    if(dataLength >= days) {
        let volumes = []
        let currentValue = {}
        for (let ind = position + 1; ind < (position + days + 1); ind++) {
            currentValue = Object.values(stockStats)[ind]
            currentValue === undefined ? volumes.push(0) : volumes.push(parseFloat(Object.values(currentValue)[4]))
        }
        const maxVolume = Math.max(...volumes)
        return parseFloat(Object.values(currentValue)[4]) > maxVolume ? true : false
    }
}

const calculateBullishPercentageSentiment = (position, days) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= days) {
        let dailySentiment = []
        
        for (let ind = position; ind < (position + days); ind++) {
            const currentValue = Object.values(stockStats)[ind]
            const previousValue = Object.values(stockStats)[ind + 1]
            if(currentValue === undefined || previousValue === undefined) {
                dailySentiment.push(0)
            } else {
                const numerator = parseFloat(Object.values(currentValue)[1]) - parseFloat(Object.values(previousValue)[3])
                const denominator = (parseFloat(Object.values(currentValue)[1]) - parseFloat(Object.values(previousValue)[3])) + (parseFloat(Object.values(currentValue)[2]) - parseFloat(Object.values(previousValue)[3]))
                dailySentiment.push(numerator / denominator)
            }
        }

        const sentimentAverage = dailySentiment.reduce((a, b) => a + b, 0) / dailySentiment.length;
        return sentimentAverage
    } 
}

const calculateRollingEnergy = (position, count = 6, days) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    
    let averageSentimentTen = []
    let averageSentimentTwentyThree = []
    if(dataLength >= 29) {
        for (let ind = position + 1; ind < (position + count + 1); ind++) {
            const averageTenDaySentiment = calculateBullishPercentageSentiment(ind, 10)
            const averageTwentyThreeDaySentiment = calculateBullishPercentageSentiment(ind, 23)

            averageSentimentTen.push(averageTenDaySentiment)
            averageSentimentTwentyThree.push(averageTwentyThreeDaySentiment)
        }
        const averageSentimentValueTen = averageSentimentTen.reduce((a, b) => a + b, 0) / averageSentimentTen.length;
        const averageSentimentValueTwentyThree = averageSentimentTwentyThree.reduce((a, b) => a + b, 0) / averageSentimentTwentyThree.length;
        if(averageSentimentValueTen > averageSentimentValueTwentyThree) {
            return 1
        }
         
        return 0

    } else {
        return -1
    }
}

const calculateAverage = (position, days, value) => {
    let average = []
    for (let ind = position; ind < (position + days); ind++) {
        const currentValue = Object.values(stockStats)[ind]
        const requiredValue = parseFloat(Object.values(currentValue)[value])
        average.push(requiredValue)
    }
    const closingAverage = average.reduce((a, b) => a + b, 0) / average.length;
    return closingAverage
}

const calculateTwentyThreeDayVolatilityAverage = (position) => {
    let average = []
    for (let ind = position; ind < (position + 23); ind++) {
        const volatility = calculateVolatility(ind)
        average.push(volatility)
    }
    const closingAverage = average.reduce((a, b) => a + b, 0) / average.length;
    return closingAverage
}

const calculateVolatilityTrend = (position) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= 26) {
        let pastThree = []
        let previousThree = []
        for (let ind = position + 1; ind < (position + 4); ind++) {
            const currentValue = Object.values(stockStats)[ind]
            const close = parseFloat(Object.values(currentValue)[3])
            const priceAndHistory = close - calculateAverage(ind, 20, 3)
            pastThree.push(priceAndHistory)
        }

        for (let ind = position + 4; ind < (position + 7); ind++) {
            const currentValue = Object.values(stockStats)[ind]
            const close = parseFloat(Object.values(currentValue)[3])
            const priceAndHistory = close - calculateAverage(ind, 20, 3)
            previousThree.push(priceAndHistory)
        }

        const averagePastThree = pastThree.reduce((a, b) => a + b, 0) / pastThree.length;
        const averagePreviousThree = previousThree.reduce((a, b) => a + b, 0) / previousThree.length;
        if(averagePastThree > averagePreviousThree) {
            return 1
        }
        return 0
    } else {
        return -1
    }
}

const calculateVolatility = (position) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= 41) {
        let sumVolatility = 0
        for (let ind = position + 1; ind < (position + 21); ind++) {
            const currentValue = Object.values(stockStats)[ind]
            const close = parseFloat(Object.values(currentValue)[3])
            const priceAndHistory = close - calculateAverage(ind, 20, 3)
            sumVolatility += priceAndHistory
        }
        const volatility = sumVolatility > 0 ? Math.sqrt(sumVolatility) : (Math.sqrt(sumVolatility * (-1)))
        return volatility
    }
    return ''
    
}

const calculateCorrelation = (position) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= 62) {
        let volatilities = []
        let prices = []
        for (let ind = position + 1; ind < (position + 24); ind++) {
            const currentValue = Object.values(stockStats)[ind]
            const close = parseFloat(Object.values(currentValue)[3])
            const volatility = calculateVolatility(ind)
            volatilities.push(volatility)
            prices.push(close)
        }
        const avgVolatility = volatilities.reduce((a, b) => a + b, 0) / volatilities.length;
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        return (avgPrice - avgVolatility)
    } else {
        return -1
    }
}

const calculatePriceTrend = (position) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= 62) {
        const next = position + 1
        const currentCorrelation = calculateCorrelation(position)
        const prevCorrelation = calculateCorrelation(next)
        const volatility = calculateVolatilityTrend(position)
        if((currentCorrelation < prevCorrelation && (volatility == 1)) || (currentCorrelation > prevCorrelation && (volatility == 0))) {
            return 1
        }

        return 0

    } else {
        return -1
    }
}

const calculateOneDayReturn = (position) => {
    console.log('pos:'+position)
    const currentValue = Object.values(stockStats)[position]
    const prevValue = Object.values(stockStats)[position + 1]
    if(currentValue !== undefined && prevValue !== undefined) {
        const currentClose = parseFloat(Object.values(currentValue)[3])
        const prevClose = parseFloat(Object.values(prevValue)[3])
        return ((currentClose - prevClose) / prevClose)
    }
}

const calculateFiveDayReturn = (position) => {
    const currentValue = Object.values(stockStats)[position]
    const prevValue = Object.values(stockStats)[position + 4]
    if(currentValue !== undefined && prevValue !== undefined) {
        const currentClose = parseFloat(Object.values(currentValue)[3])
        const prevClose = parseFloat(Object.values(prevValue)[3])
        return ((currentClose - prevClose) / prevClose)
    }
}

const calculateOneMonthReturn = (position) => {
    const currentValue = Object.values(stockStats)[position]
    const prevValue = Object.values(sixMonthData)[1]
    if(currentValue !== undefined && prevValue !== undefined) {
        const currentClose = parseFloat(Object.values(currentValue)[3])
        const prevClose = parseFloat(Object.values(prevValue)[3])
        return ((currentClose - prevClose) / prevClose)
    }
}

const calculateThreeMonthReturn = (position) => {
    const currentValue = Object.values(stockStats)[position]
    const prevValue = Object.values(sixMonthData)[3]
    if(currentValue !== undefined && prevValue !== undefined) {
        const currentClose = parseFloat(Object.values(currentValue)[3])
        const prevClose = parseFloat(Object.values(prevValue)[3])
        return ((currentClose - prevClose) / prevClose)
    }
}

const calculateSixMonthReturn = (position) => {
    const currentValue = Object.values(stockStats)[position]
    const prevValue = Object.values(sixMonthData)[6]
    if(currentValue !== undefined && prevValue !== undefined) {
        const currentClose = parseFloat(Object.values(currentValue)[3])
        const prevClose = parseFloat(Object.values(prevValue)[3])
        return ((currentClose - prevClose) / prevClose)
    }
}

const conditionalPriceFormatting = (position) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= 21) {
        const standardDeviation = calculateStandardDeviation(position, 20, 3)
        const average = calculateAverage(position, 20, 3)
        const currentValue = Object.values(stockStats)[position]
        const close = parseFloat(Object.values(currentValue)[3])

        const positiveFirstStandardDeviation = average + standardDeviation
        const positiveSecondStandardDeviation = average + (2 * standardDeviation)
        const negativeFirstStandardDeviation = average - standardDeviation
        const negativeSecondStandardDeviation = average - (2 * standardDeviation)
        
        if(close < negativeSecondStandardDeviation){
            return 'blue-white';
        }else if(close > positiveSecondStandardDeviation){
            return 'red-white';
        }else if(close < negativeFirstStandardDeviation && close > negativeSecondStandardDeviation){
            return 'black-blue';
        }else if(close > positiveFirstStandardDeviation && close < positiveSecondStandardDeviation){
            return 'black-pink';
        }else if(close < positiveFirstStandardDeviation && close > negativeSecondStandardDeviation){
            return 'black-green';
        }   
    }     
}

const conditionalVolumeFormatting = (position) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= 24) {
        const standardDeviation = calculateStandardDeviation(position, 23, 4)
        const average = calculateAverage(position, 23, 4)
        const currentValue = Object.values(stockStats)[position]
        const volume = parseFloat(Object.values(currentValue)[4])

        const positiveFirstStandardDeviation = average + standardDeviation
        const positiveSecondStandardDeviation = average + (2 * standardDeviation)
        const negativeFirstStandardDeviation = average - standardDeviation
        const negativeSecondStandardDeviation = average - (2 * standardDeviation)
        
        if(volume < negativeSecondStandardDeviation){
            return 'blue-white';
        }else if(volume > positiveSecondStandardDeviation){
            return 'red-white';
        }else if(volume < negativeFirstStandardDeviation && volume > standardDeviation){
            return 'black-blue';
        }else if(volume > positiveFirstStandardDeviation && volume < positiveSecondStandardDeviation){
            return 'black-pink';
        }else if(volume < positiveFirstStandardDeviation && volume > negativeFirstStandardDeviation){
            return 'black-green';
        }   
    }     
}

const conditionalVolatilityFormatting = (position) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= 41) {
        const standardDeviation = calculateVolatilityStandardDeviation(position, 23)
        const average = calculateTwentyThreeDayVolatilityAverage(position)
        const volatility = calculateVolatility(position)

        const positiveFirstStandardDeviation = average + standardDeviation
        const positiveSecondStandardDeviation = average + (2 * standardDeviation)
        const negativeFirstStandardDeviation = average - standardDeviation
        const negativeSecondStandardDeviation = average - (2 * standardDeviation)
        
        if(volatility < negativeSecondStandardDeviation){
            return 'blue-white';
        }else if(volatility > positiveSecondStandardDeviation){
            return 'red-white';
        }else if(volatility < negativeFirstStandardDeviation && volatility > negativeSecondStandardDeviation){
            return 'black-blue';
        }else if(volatility > positiveFirstStandardDeviation && volatility < positiveSecondStandardDeviation){
            return 'black-pink';
        }else if(volatility < positiveFirstStandardDeviation && volatility > negativeFirstStandardDeviation){
            return 'black-green';
        }   
    }     
}

const calculateVolumeSignal = (position) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    if(dataLength >= 24) {
        const tenDayAverage = calculateAverage(position + 1, 10, 4)
        const twentyThreeDayAverage = calculateAverage(position + 1, 23, 4)

        return tenDayAverage > twentyThreeDayAverage ? 1 : 0;
    }
}
const vix=()=>{window.location='/stocks/VIX'}
const tnx=()=>{window.location='/stocks/TNX'}
const uup=()=>{window.location='/stocks/UUP'}
const btc=()=>{window.location='/stocks/BTC'}

  
 


  return(
    <> 
    
 {stockStats && sixMonthData ? <div>
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
    
         
   {data &&
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
          </LineChart>}
    </FormContainer>
        <h3>Indicators</h3>
      {data ?  <Table hover table-responsive-xl>
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
                {Object.keys(stockStats).map((entry, index) => {
                    let k=0
                    let next = index++;
                    const priceFormat = conditionalPriceFormatting(index);
                    const volumeFormat = conditionalVolumeFormatting(index);
                    const volatilityFormat = conditionalVolatilityFormatting(index);
                    // if(index==100 || index==200 || index==300 || index==400){
                    //     k=k+1
                    // }
                    return (
                        <tr>
                            {calculateStockVolumes(index) === true ? <td>Volume Spike</td> : <td> </td>}
                            <td>{Object.values(stockStats[entry])[14].slice(0,10)}</td>
                            <td className={priceFormat}>${parseFloat(Object.values(stockStats[entry])[3]).toFixed(2)}</td>
                            <td className={volumeFormat}>${Object.values(stockStats[entry])[4]}</td>
                            {calculateVolumeSignal(index) === 1 ? <td className="black-green">Volume Increasing</td> : calculateVolumeSignal(index) === 0 ? <td className="black-pink">Volume Falling</td> : <td></td>}
                            {calculateOneDayReturn(index) == undefined ? <td> </td> :calculateOneDayReturn(index) > 0 ? <td className='bullish-green'>{calculateOneDayReturn(index).toFixed(5)}%</td> : <td className='bearish-red'>{calculateOneDayReturn(index).toFixed(5)}%</td>}
                            {calculateFiveDayReturn(index) == undefined ? <td> </td> :calculateFiveDayReturn(index) > 0 ? <td className='bullish-green'>{calculateFiveDayReturn(index).toFixed(5)}%</td> : <td className='bearish-red'>{calculateFiveDayReturn(index).toFixed(5)}%</td>}
                            {calculateOneMonthReturn(index) == undefined ? <td> </td> :calculateOneMonthReturn(index) > 0  ? <td className='bullish-green'>{calculateOneMonthReturn(index).toFixed(5)}%</td> : <td className='bearish-red'>{calculateOneMonthReturn(index).toFixed(5)}%</td>}
                            {calculateThreeMonthReturn(index) == undefined ? <td> </td> :calculateThreeMonthReturn(index) > 0   ? <td className='bullish-green'>{calculateThreeMonthReturn(index).toFixed(5)}%</td> : <td className='bearish-red'>{calculateThreeMonthReturn(index).toFixed(5)}%</td>}
                            {calculateSixMonthReturn(index) == undefined ? <td> </td> :calculateSixMonthReturn(index) > 0  ? <td className='bullish-green'>{calculateSixMonthReturn(index).toFixed(5)}%</td> : <td className='bearish-red'>{calculateSixMonthReturn(index).toFixed(5)}%</td>}
                            {calculateStockSentiment(index, 10) == 1 ? <td className='bearish-red'>Bearish</td> : calculateStockSentiment(index, 10) == 0 ? <td className='bullish-green'>Bullish</td>: <td></td>}
                            {calculateStockSentiment(index, 23) == 1 ? <td className='bearish-red'>Bearish</td> : calculateStockSentiment(index, 23) == 0 ? <td className='bullish-green'>Bullish</td>: <td></td>}
                            {calculateStockSentiment(index, 10) == 1 ? <td>${calculateBearishBuyBottom(index)}</td> : calculateStockSentiment(index, 10) == 0 ? <td>${calculateBullishBuyBottom(index)}</td> : <td></td>}
                            {calculateStockSentiment(index, 10) == 1 ? <td>${calculateBearishSellTop(index)}</td> : calculateStockSentiment(index, 10) == 0 ? <td>${calculateBullishSellTop(index)}</td> : <td></td>}
                            {((calculateDailyBullHigh(index, 5) == calculateDailyBullHigh(index, 20)) && calculateDailyBullHigh(index, 5) > 0 && calculateDailyBullHigh(index, 20) > 0) ? <td className='bullish-green'>Go Long</td> : <td></td>}
                            {((calculateDailyBullLow(index, 5) == calculateDailyBullLow(index, 20)) && calculateDailyBullLow(index, 5) > 0 && calculateDailyBullLow(index, 20) > 0) ? <td className='bearish-red'>Go Short</td> : <td></td>}
                            {calculateRollingEnergy(index, 6, 23) == 1 ? <td className='bullish-green'>Rising Bull</td> : calculateRollingEnergy(index, 6, 23) == 0 ? <td className='bearish-red'>Falling Bear</td> : <td></td>}
                            <td className={volatilityFormat}>{calculateVolatility(index) !== '' ? '$' + calculateVolatility(index).toFixed(2) : ''}</td>
                            {calculateVolatilityTrend(index) == 1 ? <td className='bullish-green'>Volatility Rising</td> : calculateVolatilityTrend(index) == 0 ? <td className='bearish-red'>Volatility Falling</td> : <td></td>}
                            {calculateCorrelation(index) < calculateCorrelation(next) ? <td className='bearish-red'>Falling Correlation</td> : calculateCorrelation(index) > calculateCorrelation(next) ? <td className='bullish-green'>Rising Correlation</td> : calculateCorrelation(index) == -1 && <td></td>}
                            {calculatePriceTrend(index) == 1 ? <td className='bearish-red'>Price To Fall</td> : calculatePriceTrend(index) == 0 ? <td className='bullish-green'>Price To Rise</td> : <td></td>}
                            
                        </tr>
                    )    
                })}
            </tbody>
        
        </Table>:<Loader/>}
        </div>:<div>
                    <h5>{error1 ? error1:<div> <h6>Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency</h6><br/><h5>Wait a minute</h5></div>}</h5>
                    <br/>
                    <h5>{error2} </h5>
              </div>}

  </>
 )
  
}



export default Stocks
