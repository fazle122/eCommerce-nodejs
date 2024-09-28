import { app } from './app.js';
import dotenv from 'dotenv';



dotenv.config({path:".env"});
const port = process.env.PORT || 3000;




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





