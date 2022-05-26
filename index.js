const express = require('express')
const app = express()
const session = require('express-session')
const routes = require('./routes/app');
const bodyParser = require('body-parser')
const socketIO = require('socket.io')
const http = require('http')
const nodemailer = require('nodemailer')
require('dotenv').config()

/*
console.log(process.env.EMAIL)
//Step 1
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }
})

//step 2
let mailOptions = {
    from: 'farid.puasa@globex.com.bn',
    to: 'redpuasa@gmail.com',
    subject: 'Testing',
    text: ' asjfas'
}

//step 3
transporter.sendMail(mailOptions, (err,data)=>{
    if (err) return console.log(err)
    else return console.log("Email Sent")
})
*/

//Server setup
let server = http.createServer(app)
let io = socketIO(server)

//Session setup
app.use(session({
    secret: 'Unknown Value',
    cookie: {maxAge: 2000},
    saveUninitialized: false,
    resave: true
}))

app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))
app.set('view engine', 'ejs')

const mongoose = require('mongoose');
const db = require('./config/keys').MongoURI;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(console.log('Database Connected'))
.catch(err => console.log(err))

app.use('/', routes)

io.on('connection', (socket) => {
    console.log(`User connected!`)
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, console.log(`Server start on ${PORT}`))
//update