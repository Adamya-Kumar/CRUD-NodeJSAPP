require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const session = require("express-session")
const port = process.env.PORT || 4000
const { handledbConnection } = require('./db_connection')
const UserRoutes=require("./routes/route")

const app = express()

// db connect..
handledbConnection("mongodb://127.0.0.1:27017/crud_app",{useUnifiedTopology: true}).then(()=>console.log("MongosgDB Connected")).catch((err)=>console.log(err))

//miiddleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(session({
    secret: "my secret key",
    saveUninitialized: true,
    resave:false,
}
))
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})


app.use(express.static("uploads"))

//set temeplate
app.set("view engine","ejs")

//routes
app.use("/",UserRoutes)




app.listen(port, () => {
    console.log("port at number : "+port)
})