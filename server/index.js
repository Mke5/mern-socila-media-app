const express = require('express')
const {connect} = require('mongoose')
require('dotenv').config()
const cors = require('cors')
const fileUpload = require('express-fileupload')
c
const routes = require('./routes/routes')
const cookieParser = require('cookie-parser')
const { server, app } = require('./socket/socket')
const path = require('path')


// const app = express()
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use(cookieParser())

app.use(fileUpload({
    useTempFiles: false,
    createParentPath: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

connect(process.env.MONGO_URI).then(() => {
    server.listen(process.env.PORT, ()=> {
        console.log('Server is running on port', process.env.PORT)
    })
}).catch(err => {
    console.log(err)
})