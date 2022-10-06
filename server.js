const path =require('path')
const express= require('express');
const morgan=require('morgan');
const cors=require('cors');
const errorHandler = require('./middleware/error')
const axios = require('axios')
const app = express();
const Router =require('./routes/routes.js');
const cron = require('node-cron')
const AlertsSchema=require('./model/alert')
const {
    asyncForEach,
    checkDailyAlerts,
    checkIntraDayAlerts
} = require('./utils/cron-helper');
const Alert = require('./model/alert');



require('dotenv').config();
//DB connection
require('./model/db');


app.use(express.json());
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));   
}

app.use(cors());




app.use('/api/auth',require('./routes/auth'))
app.use('/api/private',require("./routes/private"))
app.use("/api", Router);

if (process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'./frontend/build')))

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'./frontend/build/index.html'))
    })
}
else{
    app.get('/',(req,res)=>{
        res.send("API is running ....")
    })
}


cron.schedule("0 */6 * * *", async () => {
    
    await AlertsSchema.distinct("symbol")
    .then((data)=>{
        asyncForEach(data, async (symbol) => {
            await checkDailyAlerts(symbol)
        })
        

        })
    
    
})

cron.schedule("*/10 * * * *", async () => {
    await AlertsSchema.distinct("symbol")
    .then((data)=>{
        asyncForEach(data, async (symbol) => {
            await checkIntraDayAlerts(symbol)
    
        })

        })
    
    
})

//Error Handler should be last peice of code
app.use(errorHandler)
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
console.log(`server is listening at port ${PORT}`);

});
