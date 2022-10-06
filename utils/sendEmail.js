const nodemailer =require('nodemailer')
require('dotenv').config({path: '../.env'})

const sendEmail=(options)=>{
    console.log(process.env.EMAIL_PASSWORD+'and'+process.env.EMAIL_USERNAME+'and'+options.to)
    const transporter = nodemailer.createTransport({
        
        service:'gmail',
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD,
        },
      
    })

    const mailOptions = {
        from:process.env.EMAIL_USERNAME,
        to:options.to,
        cc:options.cc,
        bcc:options.bcc,
        subject:options.subject,
        html:options.text,
       
    }
     transporter.sendMail(mailOptions,function (err,info)
     {
         if (err) {
             console.log(err)
             
         } else {
             console.log("email send")
         }
     })

}
module.exports= sendEmail