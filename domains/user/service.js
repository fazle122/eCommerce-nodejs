import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";


 const generateToken = (res,userId) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'30d'})
    res.cookie(
        'jwt',
        token,
        {
            httpOnly:true,
            // secure:process.env.NODE_ENV !== 'development',
            // sameSite:'strict',
            secure:true,
            sameSite:'none',
            maxAge: 30*24*60*60*1000
        }    
)}



const sendEmail = async (options) => {
  console.log('to',options.email);
  console.log('sub',options.subject);
  // console.log('html',options.message);
  const config = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await config.sendMail(message);
};




export {generateToken,sendEmail}; 