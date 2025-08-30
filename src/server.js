const express = require('express')  ;
const http = require('http')
require('dotenv').config()

const connectDb = require('./config/db'); 
connectDb() ;

const app = require('./app') 
const server = http.createServer(app) ; 
const {connectSocket, getIo} = require('./service/socket')
connectSocket(server); 

const port= process.env.PORT || 3000
server.listen(port , ()=>{
    console.log(`start listening to http://localhost:${port}`)
})