const Alert = require("../model/alert");
const moment = require('moment')
const axios = require('axios')
const sendEmail =require('./sendEmail');;

const filterAlerts = async (symbol) => {    
    const alerts = await Alert.find();
    return alerts.filter(alert => alert.symbol === symbol)
}

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const calculateBullishPercentageSentiment = (position, days, stockStats) => {
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

const calculateRollingEnergy = (position, count = 6, stockStats) => {
    const dataLength = Object.keys(stockStats).length - position - 1
    
    let averageSentimentTen = []
    let averageSentimentTwentyThree = []
    if(dataLength >= 29) {
        for (let ind = position + 1; ind < (position + count + 1); ind++) {
            const averageTenDaySentiment = calculateBullishPercentageSentiment(ind, 10, stockStats)
            const averageTwentyThreeDaySentiment = calculateBullishPercentageSentiment(ind, 23, stockStats)

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

const checkDailyAlerts = async (symbol) => {
    const dailyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&interval=5min&apikey=${process.env.API_KEY}`
    const currentAlerts = await Alert.find({symbol: symbol})
    var dailyStockStats = {}
    
    await axios.get(dailyUrl)
        .then(async (res) => {
            dailyStockStats = Object.values(res.data)[1]
            const now = moment()
            asyncForEach(currentAlerts, async (alert) => {
                if(alert.change === 'contains' && alert.expiredAt === null) {
                    if((calculateRollingEnergy(1, 6, dailyStockStats) == 1) && (calculateRollingEnergy(0, 6, dailyStockStats) == 0) || (calculateRollingEnergy(1, 6, dailyStockStats) == 0) && (calculateRollingEnergy(0, 6, dailyStockStats) == 1)) {
                         
                        sendEmail({
                            to:alert.userEmail,
                            subject:alert.subject,
                            text:alert.note
                        }) 
                        await Alert.findByIdAndDelete(alert._id)
                    }
                } else if(alert.change === 'contains' && moment(alert.expiredAt).isAfter(moment(now)) && alert.expiredAt !== null){
                    if((calculateRollingEnergy(1, 6, dailyStockStats) == 1) && (calculateRollingEnergy(0, 6, dailyStockStats) == 0) || (calculateRollingEnergy(1, 6, dailyStockStats) == 0) && (calculateRollingEnergy(0, 6, dailyStockStats) == 1)) {
                        

                        sendEmail({
                            to:alert.userEmail,
                            subject:alert.subject,
                            text:alert.note
                        }) 
                    }
                } else if(alert.change === 'contains' && moment(alert.expiredAt).isBefore(moment(now)) && alert.expiredAt !== null) {
                    await Alert.findByIdAndDelete(alert._id)
                }

            })
            
        })
        .catch(err => console.log('error : ', err))
}


const checkIntraDayAlerts = async (symbol) => {
    const intraDayUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${process.env.API_KEY}`
    const currentAlerts = await Alert.find({symbol: symbol})
    var intraDayStockStats = {}
    await axios.get(intraDayUrl)
        .then(async (res) => {

            intraDayStockStats = Object.values(res.data)[1]
            const currentIntraDayValue = Object.values(Object.values(res.data)[1])[0]
         
            const now = moment()
            
            asyncForEach(currentAlerts, async (alert) => {
                if(alert.change === 'above' && parseFloat(Object.values(currentIntraDayValue)[3]) > alert.target && alert.expiredAt === null) {
                   
                    
                    sendEmail({
                        to:alert.userEmail,
                        subject:alert.subject,
                        text:alert.note
                    }) 
                    await Alert.findByIdAndDelete(alert._id)
                } else if(alert.change === 'below' && parseFloat(Object.values(currentIntraDayValue)[3]) < alert.target && alert.expiredAt === null) {
                    
                   
                    sendEmail({
                        to:alert.userEmail,
                        subject:alert.subject,
                        text:alert.note
                    }) 
                    await Alert.findByIdAndDelete(alert._id)
                } else if(alert.change === 'above' && parseFloat(Object.values(currentIntraDayValue)[3]) > alert.target && moment(alert.expiredAt).isAfter(moment(now)) && alert.expiredAt !== null) {
                    
                  
                    sendEmail({
                        to:alert.userEmail,
                        subject:alert.subject,
                        text:alert.note
                    }) 
                } else if(alert.change === 'below' && parseFloat(Object.values(currentIntraDayValue)[3]) < alert.target && moment(alert.expiredAt).isAfter(moment(now)) && alert.expiredAt !== null) {
                    
                   
                    sendEmail({
                        to:alert.userEmail,
                        subject:alert.subject,
                        text:alert.note
                    }) 
                } else if(alert.change === 'below' && moment(alert.expiredAt).isBefore(moment(now)) && alert.expiredAt !== null){
                    await Alert.findByIdAndDelete(alert._id)
                } else if(alert.change === 'above' && moment(alert.expiredAt).isBefore(moment(now)) && alert.expiredAt !== null){
                    await Alert.findByIdAndDelete(alert._id)
                }
            })

        })
        .catch(err => console.log('error : ', err))
}

module.exports = {
    filterAlerts,
    asyncForEach,
    calculateBullishPercentageSentiment,
    calculateRollingEnergy,
    checkDailyAlerts,
    checkIntraDayAlerts
}

