require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const { default: mongoose } = require('mongoose');
const cors = require('cors')
const app = express()
const PORT =  3000;
const conn = "mongodb+srv://user:user@cluster0.xjskjfa.mongodb.net/test";

const allowCrossDomain = (req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
};

app.use(cors())
app.use(allowCrossDomain)
app.options('*', cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect(conn)
        .then(() => console.log('connected'))
        .catch(() => console.log('Error'))
    
    // create a user --> temp

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true,
        
    },
    password: {
        type: String
    }
})

const user = mongoose.model('mymodel1', userSchema, 'userSchema')

const todoSchema = new mongoose.Schema({
   email:{
    type :String
   },
    title: {
        type: String,
       
    },
    desc: {
        type: String
    },
    time: {
        type: String
    }
})

const todolist = mongoose.model('mymodel2', todoSchema, 'todoSchema')



app.post('/createuser', async (req, res) => {
    const body = req.body;

    const name = body.name;
    const email = body.email;
    const password = body.password;
    


    const insertedUser = await user.create({name: name, email: email,password:password})

    res.json({msg: "User inserted successfully", data: insertedUser})
})


app.post('/createtodo/:email', async (req, res) => {
    const body = req.body;
    
    const {email}=req.params;
    const title = body.title;
    const desc = body.desc;
    const time = body.time;

    const insertedTodo = await todolist.create({email:email,title:title,desc:desc,time:time})

    res.json({msg: "data inserted successfully", data: insertedTodo})
})

app.get('/count', async (req, res) =>{
    res.json({count: await user.countDocuments()})
})

app.get('/tododata', async (req, res) => {
    try {
        // Fetch all users from the database
        const todoData = await todolist.find({});

        res.json(todoData);
    } catch (error) {
        console.error("Error while fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userdata = await user.findOne({ email, password });
        if (userdata) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/tododata/:email', async (req, res) => {
    const { email } = req.params;
    try {
        // Fetch all todo data where the email matches
        const todoData = await todolist.find({ email });

        res.json(todoData);
    } catch (error) {
        console.error("Error while fetching todo data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.get('/id/:name', async (req, res) => {
    const name = req.params.name;

    const namedUser = await user.find({name: name})//.where('name').equals(name);

    res.json({msg: "success", data: namedUser})
})


// http://localhost:8080/
app.listen(PORT, () => console.log("Application started on PORT " + PORT))



// GET Request (ENDPOINTS)
// app.get("/", (req, res) => {
//     res.end("Hello world")
// })

// app.get("/about", (req, res) => {
//     res.end("welcome to about page")
// })

// http://localhost:8080/name/aaryan
// app.get("/name/:myname", (req, res) => {
//     res.end("welcome " + req.params.myname)
    
// })

// POST Request (ENDPOINTS)
// TODO:body-parser

// app.post("/login", (req, res) => {
//     const body = req.body;
//     const username = body.username;
//     const pass = body.pass;

//     if(username === "aryan" && pass === 123)
//         res.json({
//             data: "success",
//         })
//     else 
//         res.end("Incorrect creds")
// })