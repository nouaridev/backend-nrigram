const express = require('express') 
require('dotenv').config()

const connectDb = require('./config/db'); 
connectDb() ;

const app = require('./app') 
const port= process.env.PORT || 3000
app.listen(port , ()=>{
    console.log(`start listening to http://localhost:${port}`)
})