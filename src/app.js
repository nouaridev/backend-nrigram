const express = require('express'); 
const app = express() ; 

app.use(express.json()) ; 

const logger = require('./middlewares/logger') 
app.use(logger); 

const userRouter = require('./routes/authRoutes')
app.use('/api/user' , userRouter)

const checkAuth = require('./middlewares/authMiddleware')
app.get('/test' ,checkAuth ,(req , res)=>{
    res.json({user: req.user})
} )

const errHandler = require('./middlewares/errorHandler')
app.use(errHandler)

module.exports = app ; 