import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoute.js';
import userRoutes from './routes/userRoute.js';
import orderRoutes from './routes/orderRoute.js';
import uploadRoutes from './routes/uploadRoute.js'
import { notFound,errorHandler } from './middleware/errorMiddleware.js';
import cookieParser   from 'cookie-parser';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import cors from "cors";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


process.on('uncaughtException',(err) =>{
    console.log(`Error: ${err}`);
    console.log("shutting down due to uncaught rejection");
    process.exit(1);
})

// dotenv.config();
// dotenv.config({path:"backend/.env"});
dotenv.config({path:".env"});
const port = process.env.PORT || 3000;

connectDB();
const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",      
            "http://127.0.0.1:5173", 
            "https://eshop-psi-hazel.vercel.app"     
        ],
        methods:['GET','POST','PUT','DELETE'],
        credentials: true,
        // allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// app.use('*', cors());
app.use(express.json({limit:'2mb'}));
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    // res.header('Access-Control-Allow-Origin', "http://localhost:5173");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });



app.use('/api/products',productRoutes); 
app.use('/api/users',userRoutes); 
app.use('/api/orders',orderRoutes); 
app.use('/api/upload',uploadRoutes); 

// const __dirname= path.resolve();
// app.use('/uploads',express.static(path.join(__dirname,'/uploads')));

app.get('/api/config/paypal',(req,res) => res.send({clientId:process.env.PAYPAL_CLIENT_ID}))


app.use(notFound);
app.use(errorHandler);


const server = app.listen(port, () =>{
     console.log(`server is running on port ${port} in ${process.env.NODE_ENV} mode`);
})

process.on('unhandledRejection',(err) =>{
    console.log(`Error: ${err}`);
    console.log("shutting down due to unhandled rejection");
    server.close(()=>{
        process.exit(1);
    });
})





