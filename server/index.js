const express = require('express')
const {connect} = require('mongoose')
require('dotenv').config()
const cors = require('cors')
const upload = require('express-fileupload')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')
const routes = require('./routes/routes')
const cookieParser = require('cookie-parser')


const app = express()
app.use(cookieParser())
app.use(express.json({
    extended: true
}))
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(express.urlencoded({
    extended: true
}))
app.use(upload())

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

connect(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, ()=> {
        console.log('Server is running on port', process.env.PORT)
    })
}).catch(err => {
    console.log(err)
})

