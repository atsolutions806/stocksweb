require('dotenv').config({path: '../.env'})
const axios=require('axios');

exports.searchData=async (req,res)=>
{
    const apikey = process.env.API_KEY;
    const {keywords} = req.query;
    let API_Call = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${apikey}`;
    
    axios.get(`${API_Call}`)
.then(
        function(data) {
          console.log(data.data)

          });

}
exports.dailyData=async (req,res)=>
{
    const apikey = process.env.API_KEY;
    const {symbol} = req.query;
    let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apikey}';}`;
    
    axios.get(`${API_Call}`)
.then(
        function(data) {
         return res.send(data.data)
           
          })
.catch((err)=>{
     return res.send(err)
})
}
