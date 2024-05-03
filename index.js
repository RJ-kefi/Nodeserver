const bodyParser = require('body-parser');
require('dotenv').config();
const express = require('express');
const { Timestamp } = require('mongodb');
const { default: mongoose } = require('mongoose');
const app = express()
app.use(bodyParser.json());
const conn = process.env.conn;
const port=process.env.port;



mongoose.connect(conn)
        .then(() => console.log('connected'))
        .catch((e) => console.log(e))

const todoSchema = new mongoose.Schema({
    Toid: {
        type: String,
        required: true
    },
    Totitle: {
        type: String
    },
    Todesc: {
        type: String
    },
    Totime: {
        type: String
     
    }
})

const user = mongoose.model('mymodel',todoSchema, 'todoschema')





app.post('/create', async (req, res) => {
    const body = req.body;

    const id = body.id;
    const title = body.title;
    const desc = body.desc;
    const time = body.time;

    const insertedUser = await user.create({Toid: id, Totitle: title, Todesc: desc, Totime:time})

    res.json({msg: "User inserted successfully", data: insertedUser})
})

app.get('/id/:id', async (req, res) => {
    const id = req.params.id;

    const idTodo= await user.find({Toid: id})

    res.json({msg: "success", data: idTodo})
})













app.use(bodyParser.json())
app.get("/",(req,res)=>{
    res.end("Hello World")
})

const userdetails=[];

app.get("/name/:myname",(req,res)=>{
    res.end("Hello "+req.params.myname)
})


app.post("/login",(req,res)=>{
    const body=req.body;
    const username=body.username;
    const pass=body.pass;
    if(username==='Ranjith' && pass=='123')
        res.end("Logged in successfully");
    else
        res.end("Invalid credentials");

})
app.post("/register",(req,res)=>{
    const body=req.body;
    const username=body.username;
    const pass=body.pass;
    const address=body.address;
    userdetails[0]=username;
    userdetails[1]=pass;
    userdetails[2]=address;
    res.end("Regesterd successfully")
  
})
app.get("/get-user/:name",(req,res)=>{
    const name=req.params.name;
    if(name==userdetails[0]){
        res.json({
            "pass":userdetails[1],
           "Address":userdetails[2]
          })
    }
    else{
        res.end("Username Not found")
    }

})

app.listen(port,()=>console.log("Application Started"))



