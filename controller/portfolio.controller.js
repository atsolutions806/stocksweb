const User =require('../model/user')

exports.addPortfolio=(req,res)=>{
const {id,symbol}=req.body

try{
User.findById(id)
.then((data)=>{
 const tickers=data.tickers
 if(tickers.includes(symbol)){
    res.status(200).json({success:true,message:'Already in Portfolio'})
 }
 else{
    tickers.push(symbol)
    User.updateOne({_id:id},{tickers:tickers})
    .then(
    res.status(200).json({success:true,message:'Added To Portfolio'})
    )

 }

})
.catch(()=>{
    res.status(400).json({success:true,error:'Unable To added'})

})
}
catch(error){
    res.status(500).json({success:false,error:'Server Crashed'})
}
}
exports.deletePortfolio=(req,res)=>{
    console.log('hi')
    const {id,ticker}=req.query
    console.log(id)
    try{
    User.find({_id:id})
    .then((data)=>{
     const tickers=data[0].tickers
     let filtered=tickers.filter(item=>item!=ticker)
        User.updateOne({_id:id},{tickers:filtered})
        .then(
        res.status(200).json({success:true,message:'Remove From Portfolio'})
        )
    
     
    
    })
    .catch(()=>{
        res.status(400).json({success:true,error:'Unable To remove'})
    
    })
    }
    catch(error){
        res.status(500).json({success:false,error:'Server Crashed'})
    }
    }