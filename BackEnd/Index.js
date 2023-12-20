const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const jwt = require("jsonwebtoken")

const dotenv = require('dotenv')


dotenv.config()
const port = process.env.PORT

// const corsOptions = {
//     origin : "https://reflect-pwdx.onrender.com"
// }
// app.use(cors(corsOptions))

app.use(cors())

app.use(express.json())
const mongodbURL = process.env.MONGO_URL



const connectionParams = {
    useNewUrlParser : true,
    useUnifiedTopology : true
}

mongoose.connect(mongodbURL,connectionParams)
    .then(()=>{
        console.log('connected to databse')
    })
    .catch(e=>{
        console.log(e)
    })

// mongoose.connect("mongodb://127.0.0.1:27017/reflection")
//     .then(()=>{
//         console.log("databse is conneted successfully")
//     })
//     .catch(()=>{
//         console.log("error connectiong databse")
//     })
    
const {Schema,model} = mongoose
const formSchema = new Schema({
    Formtitle : String,
    description : String,
    Questions : []
})

const Form = model("Form",formSchema)

app.post("/api/login",(req,res)=>{
    const body = req.body
    if(body.username == process.env.USER && body.password == process.env.PASSWORD){
        const token = jwt.sign({message : "success"},process.env.SECRET_KEY,{expiresIn : "7d"})
        res.status(200).json(token)
    }else{
        res.status(400).json({error : "invalid uesrname or password"})
    } 
})

app.get("/",(req,res)=>{
    res.send("welcome")
    console.log(process.env.USER)
})
 
app.post("/api/form",(req,res)=>{
    const body = req.body
    const frm = new Form(body)
    frm.save()
        .then(result =>{
            res.status(201).json(result)
        })
        .catch(e=>{
            res.status(500).json(e)
        })
})

app.get('/api/form',(req,res)=>{
    // const formtype = req.query.type
    // res.send(`fomr - ${formtype}`)
    const type = req.query.type
    Form.findOne({Formtitle : type})
        .then((result)=>{
            res.status(200).json(result)
        })
        .catch(e =>{
            res.status(500).json(e)
        })
})

app.get('/api/radio',(req,res)=>{
    Form.find()
    .then(result =>{
        res.status(200).json(result)
    })
    .catch(e=>{
        res.status(500).json(e)
    })
})

app.get(`/api/form/:id`,(req,res)=>{

    const id = req.params.id
    Form.findById(id)
    .then(result =>{
        res.status(200).json(result)
    }) 
    .catch(e=>{
        res.status(500).json(e)
    })
})

app.put("/api/form/:id",(req,res)=>{
    const id = req.params.id
    Form.findByIdAndUpdate(id,req.body,{new :true})
    .then((result)=>{
        res.json(result)
    })
    .catch(e=>{
        res.json(e)
    })
})

app.delete("/api/form/:id",(req,res)=>{
    const id = req.params.id
    Form.findByIdAndDelete(id)
    .then((result)=>{
        res.json(result)
    })
    .catch(e=>{
        res.json(e)
    })
})


app.listen(port,()=>{
    console.log('server is running on',port)
})


