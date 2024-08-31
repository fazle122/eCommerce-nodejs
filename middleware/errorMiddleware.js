import ErrorHandler from "../utils/errorHandlers.js";


const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };


  
// const errorHandler = (err, req, res, next) => {
//   let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   let message = err.message;

//   res.status(statusCode).json({
//     message: message,
//     stack: process.env.NODE_ENV === 'production' ? null : err.stack,
//   });
// };




const errorHandler = (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || 'Internal server error'
  }


  if(err.name === 'CastError'){
    const message = `Resoucre not found, Invalid ${err?.path}`;
    error = new ErrorHandler(message,404);
  }



  if(err.name === 'ValidationError'){
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler(message,400);
  }

  if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    error = new ErrorHandler(message,404);
  }


  if(err.name === 'JsonWebTokenError'){
    const message = `JSON web token is invalid, try again later `;
    error = new ErrorHandler(message,400);
  }

  if(err.name === 'TokenExpiredError'){
    const message = `JSON web token is expired`;
    error = new ErrorHandler(message,400);
  }


  if(process.env.NODE_ENV === 'development'){
    res.status(error.statusCode).json({
      message: error.message,
      error:err,
      stack:err?.stack, 
    });
  }

  if(process.env.NODE_ENV === 'production'){
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};




  
export { notFound, errorHandler };