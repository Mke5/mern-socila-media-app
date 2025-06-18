require('dotenv').config()

const notFound = (req, res, next) => {
    const error = new Error('Not Found - '+ req.originalUrl)
    res.status(404)
    next(error)
}



const errorHandler = (error, req, res, next) => {
    // if(res.headerSent){
    //     return next(error)
    // }
    // res.status(error.statusCode || 500).json({message: error.message || "An unknown error occurred"})

    const status = error.statusCode || 500;
    const message = error.message || 'Something went wrong';

    if (process.env.NODE_ENV === 'production') {
        console.error(`[ERROR] ${status} - ${message}`);
    }

    res.status(status).json({
        status: 'error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
}




module.exports = {
    notFound,
    errorHandler
}