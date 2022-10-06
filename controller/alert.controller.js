
const Alert =require('../model/alert')
const User =require('../model/user')
const sendEmail =require('../utils/sendEmail');;
const moment=require('moment')
require('dotenv').config({path: '../.env'})
exports.addAlert=async (req,res,next)=>
{
   
    const {symbol,trend,change,target,subject,note,id}=req.body
    let emails=[]
    let expiredAt = null
    if(trend.includes('Activity Alert')) {
        const now = moment()
        expiredAt = moment(now).add(365, 'd')
       }
            try {
                User.find({_id:id}
                    ).then((data)=>{
                        let userEmail=data[0].email
                        let userId=id
                       let tickers=['']
                      tickers =data[0].tickers
                      if(tickers.includes(String(symbol))){
                        console.log('no man')
                      }
                      else{
                        User.updateOne({_id:id},{tickers:[symbol]})
                        
                      }
                     let tar =parseFloat(target)
                     console.log(tar)
                        const alert =  Alert.create({
                            symbol,trend,change,target:tar,subject,note,userEmail,userId,expiredAt
                        })
                       .then(
                      
                         res.status(200).json({success:true, message:"Alert Generated"})
                    
                        )
                        .catch((err)=>{
                         res.status(400).json({success:true, message:"Alert Not Generated"})
                          
                        })
                         } )
                
                }
               
             catch (error) {
                
                res.status(500).json({success:false, data:"Server Crash"})
            }
        
   
}

exports.alerts=async(req,res)=>{
    const {search}=req.query
    const {id}=req.query
    if(search){
         arry=search.split('-')
        await Alert.find({userId:id,symbol: { $regex: arry[0],'$options' : 'i'},trend:arry[1]}).sort({_id:-1})
        .then((data)=>{
            
            return res.send(data)})
        .catch( (err)=>{
            return res.status(200).json({success:true, token:'Error Loading Data'})
        })
    }
    else{
    await Alert.find({userId:id}).sort({_id:-1})
    .then((data)=>{
        return res.send(data)})
    .catch( (err)=>{
        return res.status(200).json({success:true, token:'Error Loading Data'})
    })  
}

}
exports.deleteAlert=async(req,res)=>{
    
    const id=req.query.id
  
    await Alert.findByIdAndDelete(id, (error, data) => {
        if (error) {
            
            throw error;
        } else {
            
            res.status(204).json(data);
            
        }
    });

}
exports.findUserAlert=async(req,res)=>{
    
    const id=req.query.id
  
    await User.find ({_id:id})
        .then((data)=>{
            res.send(data[0].tickers)

        })
        .catch((err)=>{
            res.status(400).json(err);
        })
    }
