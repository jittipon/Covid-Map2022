const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require("mongoose")
const colors = require('colors')
const axios = require('axios')
const connectDB = require('./backend/config/db')
const auth = require('./backend/middleware/auth')

const multer = require('multer');

const jwt= require('jsonwebtoken')
const config = process.env

connectDB()

const { errorHandler } = require('./backend/middleware/errorMiddleware')

const port = 5000
const app = express()


var cors = require('cors');
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))



app.use('/api/hospitals', require('./backend/routes/hospitalsRoutes'))
app.use('/api/announces', require('./backend/routes/announceRoutes'))
app.use('/api/Users', require('./backend/routes/userRouters'))
app.use('/api/login', require('./backend/routes/loginRouters'))
app.use('/api/map', require('./backend/routes/mapRoutes'))



app.post('/api/authen', (req, res) => {
    const authHeader = JSON.stringify(req.headers.authorization)
    const token = authHeader.substring(8, authHeader.length-1);
    try{
        const decode= jwt.verify(token, config.TOKEN_KEY)
        req.user=decode
        res.status(200).json(decode)
    }catch(err){
        res.status(401)
        throw new Error('invalid token')
    }

    if(!authHeader){
        res.status(403)
        throw new Error("A token is required for authentication")
    }
    
});




app.use(errorHandler)

app.listen(port, () => console.log('server startedon port', port))