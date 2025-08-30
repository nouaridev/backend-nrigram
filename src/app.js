const express = require('express'); 
const app = express() ; 

app.use(express.json()) ; 

const logger = require('./middlewares/logger') 
app.use(logger); 

const userRouter = require('./routes/authRoutes')
app.use('/api/user' , userRouter)

const conversationsRouter = require('./routes/conversationRoutes') ; 
app.use('/api/main' , conversationsRouter)

const errHandler = require('./middlewares/errorHandler')
app.use(errHandler)

module.exports = app ; 