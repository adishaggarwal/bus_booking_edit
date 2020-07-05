const express = require('express');
const app=express();
const mongoose=require('./database/mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors=require('cors');
app.use(cors());

//CORS 
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    next();
})



//auth
const jwt = require("jsonwebtoken");
const config = require("./config");
const authorize = require("./authorization-middleware");



//token genereTION

/*
app.get("/token", (req, res) => {
    const payload = {
      name: "Jimmy",
      scopes: ["admin:access"]
    };
  
    const token = jwt.sign(payload, config.JWT_SECRET);
    res.send(token);
  });
*/

let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmltbXkiLCJzY29wZXMiOlsiYWRtaW46YWNjZXNzIl0sImlhdCI6MTU5MzE4OTM5Nn0.PJhOXRDMg-9XZlCJMLoHZpTtl8-C3l4lXeCZfXIeXN0";
  


const Admin=require('./database/models/admin');
const Customer=require('./database/models/customer');


//Bus Create,update,readone,readall,delete

const admincontroller=require('./controllers/admincontroller');
const customercontroller=require('./controllers/customercontroller');

admincontroller(app);

customercontroller(app);


app.listen(3000,()=> 
    console.log("Hey, Welcome to ticket booking system")
)