const axios=require('axios');


exports.getStockData=async(req,res)=>
{
    const apikey = process.env.API_KEY;
    let {ticker} = req.query;
    let {tdate} = req.query;
    let {fdate} = req.query;
    if(ticker=='VIX'|| ticker=='vix')
    {
     ticker='uvxy'
    }
    if(ticker=='TNX'|| ticker=='tnx')
    {
        ticker='tbx'
    }
    if(ticker=='BTC'|| ticker=='btc')
    {
        ticker='btcusd'
    }
    console.log(tdate+' '+fdate+' '+ticker)
    let sixMonthData={}
    let  stockStats={}
    let   dataOfGraph={} 
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
    const setDataOfGraph=(sliced)=>{

             let num=0
             let pushData=[]
             for (var key in sliced) {
         if((calculateBullishSellTop (num)!==undefined) && (calculateBullishBuyBottom(num)!==undefined) ){
                
            const obj={date:Object.values(sliced[key])[14].slice(0,10),close:Object.values(sliced[key])[3] ,bullishTop:calculateBullishSellTop(num)  ,bullishBottom:calculateBullishBuyBottom(num) }
            pushData.push(obj)
           }
            num=num+1
           }
           let revData=pushData.reverse()
            return revData
        
       }
    const url = `http://api.marketstack.com/v1/eod?access_key=fbcc4d37fa291f8e8d972b26e005b880&symbols=${ticker}&limit=400&date_from=${tdate}&date_to=${fdate}` 
    const monthlyUrl = `http://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${ticker}&apikey=${process.env.API_KEY}`
 

 axios.get(monthlyUrl)
          .then(res1 => {
            if(res1.data){
                sixMonthData=Object.values(res1.data)[1]                  
            }
                      else{
                       console.log('not possible')
                      }
             })
            .catch((err)=>{ 
                console.log('not possible')
            })

  axios.get(url) 
            .then(response => {

                        if(response.data){
                        stockStats=Object.values(response.data)[1]
                        dataOfGraph=setDataOfGraph( Object.values(response.data)[1]) 
                        let column1=[] ;let column2=[]; let column3=[] ;let column4=[];let column5=[];let column6=[];let column7=[];let column8=[];
                        let column9=[];let column10=[];let column11=[];let column12=[];let column13=[];let column14=[];let column15=[];let column16=[];let column17=[];let column18=[];
                        let column19=[];let column20=[];let column21=[];let column22=[];let column24=[];let column23=[];let column25=[];let column26=[]; 
                        let priceFormat=[]; let volumeFormat=[]; let volatilityFormat=[]               
                        Object.keys(stockStats).map((entry, index) => {
                            
                            let next = index++;
                            priceFormat[index] = conditionalPriceFormatting(index);
                            volumeFormat[index] = conditionalVolumeFormatting(index);
                            volatilityFormat[index] = conditionalVolatilityFormatting(index);
                            column1[index]= calculateStockVolumes(index);
                            column2[index]=Object.values(stockStats[entry])[14].slice(0,10)
                            column3[index]=(Object.values(stockStats[entry])[3]).toFixed(2)
                            column22[index]=(Object.values(stockStats[entry])[4])
                            column4[index]= calculateVolumeSignal(index)
                            column5[index]=calculateOneDayReturn(index)          
                            column6[index]=calculateFiveDayReturn(index)
                            column7[index]=calculateOneMonthReturn(index)
                            column8[index]=calculateThreeMonthReturn(index)
                            column9[index]=calculateSixMonthReturn(index) 
                            column10[index]=calculateStockSentiment(index, 10) 
                            column11[index]=calculateStockSentiment(index, 23) 
                            column12[index]=calculateDailyBullHigh(index, 5)
                            column13[index]=calculateDailyBullHigh(index, 20)
                            column14[index]=calculateDailyBullLow(index, 5)
                            column15[index]=calculateDailyBullLow(index, 20)
                            column16[index]=calculateRollingEnergy(index, 6, 23)
                            column17[index]=calculateVolatility(index)
                            column18[index]=calculateVolatilityTrend(index)
                            column19[index]=calculateCorrelation(index)
                            column20[index]=calculateCorrelation(next)
                            column21[index]=calculatePriceTrend(index)
                            column23[index]=calculateBearishBuyBottom(index)
                            column24[index]=calculateBullishBuyBottom(index)
                            column25[index]=calculateBearishSellTop(index)
                            column26[index]=calculateBullishSellTop(index)
                    
                        })
                        let DataObject={
                            column1:column1,column2:column2,column3:column3,column4:column4,
                            column5:column5,column6:column6,column7:column7,column8:column8,column9:column9,
                            column10:column10,column11:column11,column12:column12,column13:column13,
                            column14:column14,column15:column15,column16:column16,column17:column17,
                            column18:column18,column19:column19,column20:column20,column21:column21,
                            column22:column22,column23:column23,column24:column24,column25:column25,column26:column26,
                            dataOfGraph:dataOfGraph,priceFormat:priceFormat,volumeFormat:volumeFormat,volatilityFormat:volatilityFormat
                        }
                        res.send(DataObject);
                    
                    }
                    else{
                        res.status(400).json({success:false, data:"No daily data calculated"})
                    }
                    })
                    .catch((err )=>{ 
                        res.status(502).json({success:false, data:'error fetching data'})
                        console.log(err)
                    })

}
