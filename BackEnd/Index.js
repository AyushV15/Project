const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const dotenv = require('dotenv')


dotenv.config()
const port = process.env.PORT
app.use(express.json())
app.use(cors())
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

app.get("/",(req,res)=>{
    res.send("welcome")
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


app.listen(port,()=>{
    console.log('server is running on',port)
})


