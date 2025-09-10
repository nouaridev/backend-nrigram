const express = require('express'); 
const app = express() ; 
const cors = require('cors')

app.use(cors())

app.use(express.json()) ; 
 app.use(express.urlencoded({ extended: true })); 
 
const logger = require('./middlewares/logger') 
app.use(logger); 

const userRouter = require('./routes/authRoutes')
app.use('/api/user' , userRouter)

const conversationsRouter = require('./routes/conversationRoutes') ; 
app.use('/api/main' , conversationsRouter)

const menuRouter = require('./routes/menuRoutes') ; 
app.use('/api/menu' , menuRouter)

const errHandler = require('./middlewares/errorHandler')
app.use(errHandler)

module.exports = app ; 