const express = require('express'); 
const app = express() ; 

app.use(express.json()) ; 

const logger = require('./middlewares/logger') 
app.use(logger); 

const userRouter = require('./routes/authRoutes')
app.use('/api/user' , userRouter)

module.exports = app ; 