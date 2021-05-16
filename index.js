//this file allows us to run our app on port 5000
//run game using node index.js
//open localhost:5000 on browser

const { Console } = require('console');
const express=require('express')
const app=express()

const PORT=5000;

app.use(express.static('public'))

app.listen(PORT,()=>{
    console.log(`Listening on: ${PORT}`)

})