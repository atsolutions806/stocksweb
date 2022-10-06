import React, { useEffect, useState } from 'react'


const Indicators = ({ stockStats }) => {
    // useEffect(() => {
    //     console.log('stock stats : ', stockStats)
    // }, [stockStats])

    const calculateStandardDeviation = (position) => {
        const numOfDays = 20;
        const dataLength = Object.keys(stockStats).length - position - 1
        if(dataLength >= 21) {
            const mean = calculateMean(position);
            let sumOfVariance = 0;
            
            for (let index = position + 1; index < position + numOfDays + 1; index++) {
                const currentValue = Object.values(stockStats)[index]
                const close = parseFloat(Object.values(currentValue)[3])
                const variance = close - mean
                const squaredVariance = generateSquare(variance)
                sumOfVariance += squaredVariance
            }
    
            const quotient = sumOfVariance / (numOfDays - 1)
            return Math.sqrt(quotient)
        }
    }

    const calculateMean = (position) => {
        const numOfDays = 20;
        let mean = 0;

        for(let index = position + 1; index < position + numOfDays + 1; index++) {
            const currentValue = Object.values(stockStats)[index]
            const close = parseFloat(Object.values(currentValue)[3])
            mean += close
        }

        return (mean / numOfDays);
    }

    const generateSquare = (num) => {
        return num * num
    }

    const calculateBullishBuyBottom = (position) => {
        const dataLength = Object.keys(stockStats).length - position - 1
        if(dataLength >= 21) {
            const standardDeviation = calculateStandardDeviation(position)
            const average = calculateTwentyDayAverage(position + 1)
            const buyBottom = average - standardDeviation
            return buyBottom.toFixed(2)
        }
    }

    const calculateBullishSellTop = (position) => {
        const dataLength = Object.keys(stockStats).length - position - 1
        if(dataLength >= 21) {
            const standardDeviation = calculateStandardDeviation(position)
            const average = calculateTwentyDayAverage(position + 1)
            const sellTop = average + (3 * standardDeviation)
            return sellTop.toFixed(2)
        }
    }

    const calculateBearishBuyBottom = (position) => {
        const dataLength = Object.keys(stockStats).length - position - 1
        if(dataLength >= 21) {
            const standardDeviation = calculateStandardDeviation(position)
            const average = calculateTwentyDayAverage(position + 1)
            const buyBottom = average - (3 * standardDeviation)
            return buyBottom.toFixed(2)
        }
    }

    const calculateBearishSellTop = (position) => {
        const dataLength = Object.keys(stockStats).length - position - 1
        if(dataLength >= 21) {
            const standardDeviation = calculateStandardDeviation(position)
            const average = calculateTwentyDayAverage(position + 1)
            const sellTop = average + standardDeviation
            return sellTop.toFixed(2)
        }
    }

    const calculateDailyBullHigh = (position, days) => {
        const dataLength = Object.keys(stockStats).length - position - 1
        if(dataLength < 20) {
            return -1
        }
        let highValues = []
        for (let ind = position; ind < (position + days); ind++) {
            const currentValue = Object.values(stockStats)[ind]
            currentValue === undefined ? highValues.push(0) : highValues.push(parseFloat(Object.values(currentValue)[1]))
        }
        
        return Math.max(...highValues)
    }

    const calculateDailyBullLow = (position, days) => {
        const dataLength = Object.keys(stockStats).length - position - 1
        if(dataLength < 20) {
            return -1
        }
        let lowValues = []
        for (let ind = position; ind < (position + days); ind++) {
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
        const days = 15
        if(dataLength >= days) {
            let volumes = []
            let currentValue = {}
            for (let ind = position; ind < (position + days); ind++) {
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

    const calculateTwentyDayAverage = (position) => {
        let average = []
        for (let ind = position; ind < (position + 20); ind++) {
            const currentValue = Object.values(stockStats)[ind]
            const close = parseFloat(Object.values(currentValue)[3])
            average.push(close)
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
                const priceAndHistory = close - calculateTwentyDayAverage(ind)
                pastThree.push(priceAndHistory)
            }

            for (let ind = position + 4; ind < (position + 7); ind++) {
                const currentValue = Object.values(stockStats)[ind]
                const close = parseFloat(Object.values(currentValue)[3])
                const priceAndHistory = close - calculateTwentyDayAverage(ind)
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
        let sumVolatility = 0
        for (let ind = position + 1; ind < (position + 21); ind++) {
            const currentValue = Object.values(stockStats)[ind]
            const close = parseFloat(Object.values(currentValue)[3])
            const priceAndHistory = close - calculateTwentyDayAverage(ind)
            sumVolatility += priceAndHistory
        }
        const volatility = sumVolatility > 0 ? Math.sqrt(sumVolatility) : (Math.sqrt(sumVolatility * (-1)))
        return volatility
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
            // console.log('currentCorrelation : ', currentCorrelation)
            const prevCorrelation = calculateCorrelation(next)
            // console.log('prevCorrelation : ', prevCorrelation)
            const volatility = calculateVolatilityTrend(position)
            // console.log('volatility : ', volatility)
            if((currentCorrelation < prevCorrelation && (volatility == 1)) || (currentCorrelation > prevCorrelation && (volatility == 0))) {
                return 1
            }

            return 0

        } else {
            return -1
        }
    }


    return (
        <>
        { calculateStockSentiment(1, 23) == 1 ? <td className='bearish-red'>'Bearish'</td> : calculateStockSentiment(1, 23) == 0 ?<td className='bullish-green'> 'Bullish'</td>: ''}
        {((calculateDailyBullHigh(1, 5) == calculateDailyBullHigh(1, 20)) && calculateDailyBullHigh(1, 5) > 0 && calculateDailyBullHigh(1, 20) > 0) ? <td className='bearish-green'>Go Long</td> :
        ((calculateDailyBullLow(1, 5) == calculateDailyBullLow(1, 20)) && calculateDailyBullLow(1, 5) > 0 && calculateDailyBullLow(1, 20) > 0) ? <td className='bullish-red'>Go Short</td> : <td></td>}
       <td> {calculateStockSentiment(1, 23) == 1 ? `${calculateBearishBuyBottom(1)}-${calculateBearishSellTop(1)}` : `${calculateBullishBuyBottom(1)}-${calculateBullishSellTop(1)}`}</td>
        {calculateRollingEnergy(1, 6, 23) == 1 ? <td className='bullish-green'>Rising Bull</td> : calculateRollingEnergy(1, 6, 23) == 0 ? <td className='bearish-red'>Falling Bear</td> : <td></td>}
       
        {calculateStockVolumes(1) ? <td className='orange'>Volume Spike</td> : <td></td>}
        {calculateStockSentiment(1, 10) == 1 ?<td className='bearish-red'>  'Bearish' </td>: calculateStockSentiment(1, 10) == 0 ? <td className='bullish-green'>'Bullish'</td>: ''}
        {calculateVolatilityTrend(1) == 1 ? <td className='bullish-green'>Volatility Rising</td> : calculateVolatilityTrend(1) == 0 ? <td className='bearish-red'>Volatility Falling</td> : <td></td>}
        {calculatePriceTrend(1) == 1 ? <td className='bearish-red'>Price To Fall</td> : calculatePriceTrend(1) == 0 ? <td className='bullish-green'>Price To Rise</td> : <td></td>}
        </>
    )
}

export default Indicators