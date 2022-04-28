const express = require('express')
const app = express()
const session = require('express-session')
const routes = require('./routes/app');
const bodyParser = require('body-parser')


app.use(session({
    secret: 'Unknown Value',
    cookie: {maxAge: 2000},
    saveUninitialized: false,
    resave: false
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


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server start on ${PORT}`))
//update