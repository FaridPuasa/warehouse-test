const express = require('express');
const router = express.Router();
const moment = require('moment')
const bcrypt = require('bcrypt')
const alert = require('alert');
//const fastCsv = require('fast-csv')

//Models listing
//const statusDB = require('../models/inventory')
const inventories = require('../models/inventories');
const deliScheduleDB = require('../models/delischedule');
const podOutDB = require('../models/podOut');
const userDB = require('../models/user')
const podDB = require('../models/pod');
const dispatchDB = require('../models/dispatch');
const exportDB = require('../models/exportReturn');
const grpMalaysiaDB = require('../models/grpMalaysia');

//middlewares
const { findOne, findOneAndUpdate, listenerCount } = require('../models/inventories');
const { render } = require('ejs');
const { request } = require('express');
const res = require('express/lib/response');
const delischedule = require('../models/delischedule');

let currentUser = {}

router.get('/tookout', (req,res)=>{
    console.log(req.body.trackingNumber)
    res.render('pew')
})

router.post('/editSuccess', (req,res)=>{
    if (req.body.formMETHOD == "editTC"){
        editSubmitTC(req,res)
    }
    else if (req.body.formMETHOD == "editWH"){
        editSubmitWH(req,res)
    }
    else{
        alert(`Failed to update data.`)
    }
})



function editSubmitTC(req,res){
    let tracker = req.body.trackingNumber
    let filter = {trackingNumber: tracker}
    let upate = {
        adress: req.body.adress,
        contact: req.body.contact,
        area: req.body.area,
        areaIndicator: req.body.areaIndicator,
    }
    inventories.findOneAndUpdate(filter,update,option, (err,result)=>{
        if (err){
            console.log(err)
            alert(`Failed to update the information for ${tracker}`)
        }
        else{
            alert(`${tracker} has been removed from schedule for delivery list at ${date} by ${agent}.`)
            res.status(204).send()
            res.end()
        }
    })
}

function editSubmitWH(req,res){
    let tracker = req.body.trackingNumber
    let filter = {trackingNumber: tracker}
    let update = {
        area: req.body.area,
        areaIndicator: req.body.areaIndicator,
        note: req.body.note,
    }
    inventories.findOneAndUpdate(filter,update,option, (err,result)=>{
        if (err){
            console.log(err)
            alert(`Failed to update the information for ${tracker}`)
        }
        else{
            alert(`${tracker} has been removed from schedule for delivery list at ${date} by ${agent}.`)
            res.status(204).send()
            res.end()
        }
    })
}

router.get('/podlistfi', (req,res) => {
    podDB.find({}, (err,pod) => {
        res.render('podList', {
            podList: pod,
        })
    })
})

//get list by product
router.get('/list/ZALORA/:area/:page/:limit', (req,res,next)=>{
    let limit = req.params.limit || 10
    let page = req.params.page || 1
    let area = req.params.area
    
    inventories
        .find({area: area})
        .sort({entryDate: -1})
        .exec(function(err, inventory) {
            inventories.count({area:area}).exec(function(err, count) {
                if (err) return next(err)
                res.render('itemList1', {
                    moment: moment,
                    itemList: inventory,
                    total: count,
                    current: page,
                    limit: limit,
                    name: currentUser.name,
                    icNumber: currentUser.icNumber,
                    position: currentUser.position,
                    pages: Math.ceil(count / limit)
                })
            })
        })
})

router.get('/list/PHARMACY/:area/:page/:limit', (req,res,next)=>{
    let limit = req.params.limit || 10
    let page = req.params.page || 1
    let area = req.params.area
    inventories
        .find({area: area})
        .sort({entryDate: -1})
        .exec(function(err, inventory) {
            inventories.count({area:area}).exec(function(err, count) {
                if (err) return next(err)
                res.render('itemList1', {
                    itemList: inventory,
                    total: count,
                    current: page,
                    limit: limit,
                    name: currentUser.name,
                    icNumber: currentUser.icNumber,
                    position: currentUser.position,
                    pages: Math.ceil(count / limit)
                })
            })
        })
})

router.get('/list/GRP/:area/:page/:limit', (req,res,next)=>{
    let limit = req.params.limit || 10
    let page = req.params.page || 1
    let area = req.params.area
    inventories
        .find({area: area})
        .sort({entryDate: -1})
        .exec(function(err, inventory) {
            inventories.count({area:area}).exec(function(err, count) {
                if (err) return next(err)
                res.render('itemList1', {
                    itemList: inventory,
                    total: count,
                    current: page,
                    limit: limit,
                    name: currentUser.name,
                    icNumber: currentUser.icNumber,
                    position: currentUser.position,
                    pages: Math.ceil(count / limit)
                })
            })
        })
})

//get podlist by area
router.get('/podlist/:area/:page/:limit', (req,res,next)=>{
    let limit = req.params.limit || 10
    let page = req.params.page || 1
    let area = req.params.area
    
    podDB
        .find({ podArea: area })
        .sort({entryDate: -1})
        .exec(function(err, pod) {
            inventories.count({podArea: area}).exec(function(err, count) {
                if (err) return next(err)
                res.render('podList', {
                    podList: pod,
                    total: count,
                    current: page,
                    limit: limit,
                    name: currentUser.name,
                    icNumber: currentUser.icNumber,
                    position: currentUser.position,
                    pages: Math.ceil(count / limit)
                })
            })
        })
})

//get podlist by name
router.get('/podlist/:name', (req,res,next)=>{
    let limit = req.params.limit || 10
    let page = req.params.page || 1
    let name = req.params.agentName.toUpperCase()
    
    podDB
        .find({ podAssign: name })
        .sort({entryDate: -1})
        .exec(function(err, pod) {
            inventories.count({}).exec(function(err, count) {
                if (err) return next(err)
                res.render('podList', {
                    podList: pod,
                    total: count,
                    current: page,
                    limit: limit,
                    name: currentUser.name,
                    icNumber: currentUser.icNumber,
                    position: currentUser.position,
                    pages: Math.ceil(count / limit)
                })
            })
        })
})

//get podlist by date
router.get('/podlist/:date', (req,res,next)=>{
    let limit = req.params.limit || 10
    let page = req.params.page || 1
    let date = moment(req.params.date).format('DD/MM/YYYY')
    
    podDB
        .find({ podDate: date })
        .sort({entryDate: -1})
        .exec(function(err, pod) {
            inventories.count({}).exec(function(err, count) {
                if (err) return next(err)
                res.render('podList', {
                    podList: pod,
                    total: count,
                    current: page,
                    limit: limit,
                    name: currentUser.name,
                    icNumber: currentUser.icNumber,
                    position: currentUser.position,
                    pages: Math.ceil(count / limit)
                })
            })
        })
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(function (err) {
      if (err) {
        console.error("--> session destroy failed.err -> ", err);
      }
    });
    res.redirect("/login");
});

router.get("/cs", (req,res)=>{
    inventories.find({}, function(err,inventory){
        res.render('newlist', {
            itemList: inventory,
            moment: moment
        })
    })
})

router.get('/outlist/:page/:limit', (req,res,next) => {
    var limit = req.params.limit || 10
    var page = req.params.page || 1

    inventories
        .find({})
        .sort({entryDate: -1})
        .skip((limit * page) - limit)
        .limit(limit)
        .exec(function(err, inventory) {
            inventories.count({}).exec(function(err, count) {
                if (err) return next(err)
                res.render('addtooutlist', {
                    itemList: inventory,
                    total: count,
                    current: page,
                    limit: limit,
                    name: currentUser.name,
                    icNumber: currentUser.icNumber,
                    position: currentUser.position,
                    pages: Math.ceil(count / limit)
                })
            })
        })
})

router.get('/schedulelist/:page/:limit', (req,res,next) => {
    var limit = req.params.limit || 10
    var page = req.params.page || 1
    delischedule
        .find({})
        .sort({entryDate: -1})
        .skip((limit * page) - limit)
        .limit(limit)
        .exec(function(err, inventory) {
            delischedule.count({}).exec(function(err, count) {
                if (err) return next(err)
                res.render('addtopod', {
                    itemList: inventory,
                    total: count,
                    current: page,
                    limit: limit,
                    name: currentUser.name,
                    icNumber: currentUser.icNumber,
                    position: currentUser.position,
                    pages: Math.ceil(count / limit)
                })
            })
        })
})


/*************************************************************** VERSION 2 ***************************************************************************/

router.post("/outlist/:page/:limit", (req,res) => {
    addToItemOut(req,res)
})

//Add to item out for warehouse to locate the parcel [Sowdeq --> Warehouse]
function addToItemOut(req,res,next){
    let item = req.body
    let date = moment().format("DD/MM/YYYY, h:mm:ss a")
    let agent = "TEST"
    let tracker = item.trackingNumber
    let filter = {trackingNumber: tracker}
    let update = {
            status: "SCHEDULE FOR DELIVERY by " + agent  + " at " + date, 
            $push: { history: {
                statusDetail: "SCHEDULE FOR DELIVERY by " + agent + " at " + date, 
                dateUpdated: date,
                updateBy: req.body.username, 
                updateById: req.body.userID, 
                updateByPos: req.body.userPos
            }
        }
    }
    //let option = {upsert: true, new: true}
    let status = req.body.status
    console.log(filter)
    //console.log(status)
    let deliSchedule = new deliScheduleDB({
        trackingNumber: item.trackingNumber,
        parcelNumber: item.parcelNumber,
        name: item.name,
        address: item.address,
        contact: item.contact,
        value: item.value,
        area: item.area,
        areaIndicator: item.areaIndicator,
        product: item.product,
        note: item.note,
        dateSchedule: date,
    })
    deliSchedule.save((err) => {
        if(err){
            console.log(err)
            alert(err)
        }
        else{
            inventories.findOneAndUpdate(filter,update,(err,result) => {
                if(err) return console.log (err)
                else{
                    alert(`${tracker} has been release for pod or self-collect at ${date} to ${agent}.`)
                    res.status(204).send()
                    res.end()
                }
            })
        }
    })
}

router.get("/schedulelist", (req,res) => {
    findScheduleList (req,res)
})

//If removed from outlist and pod
function removedFromSchedule(req,res){
    let item = req.body
    let date = moment().format("DD/MM/YYYY, h:mm:ss a")
    let tracker = item.trackingNumber
    console.log(item.trackingNumber)
    let filter = {trackingNumber: item.trackingNumber}
    let update = {
        status: "IN WAREHOUSE" + "[" +req.body.area + "]",
        $push: {
            history:{
                statusDetail: "IN WAREHOUSE" + "[" +req.body.area + "]" , 
                dateUpdated: date,
                updateBy: req.body.username, 
                updateById: req.body.userID, 
                updateByPos: req.body.userPos
            }
        }
    }
    inventories.findOneAndUpdate(filter,update,(err,result) => {
        if(err){
            alert(`Failed to update ${tracker}`)
            console.log(err)
        }
        else{
            deliScheduleDB.deleteOne(filter, (err)=> {
                if(err){
                    alert(`Failed to removed ${tracker}`)
                }
                else{
                    alert(`${tracker} has been removed from schedule for delivery list at ${date} by ${agent}.`)
                    res.status(204).send()
                    res.end()
                }
            })
        }
    })
}

router.get('/addtopod/:area/:page/:limit', (req,res,next)=>{
    let limit = req.params.limit || 10
    let page = req.params.page || 1
    let area = req.params.area
    
    podOutDB
        .find({ podArea: area })
        .sort({entryDate: -1})
        .exec(function(err, podOut) {
            podOutDB.count({podArea: area}).exec(function(err, count) {
                if (err) return next(err)
                res.render('podbylist', {
                    podOut: podOut,
                    total: count,
                    current: page,
                    limit: limit,
                    name: currentUser.name,
                    icNumber: currentUser.icNumber,
                    position: currentUser.position,
                    pages: Math.ceil(count / limit)
                })
            })
        })
})

//Add to POD for TC to create pod [Warehouse --> Sowdeq]
function addToPod(req,res){
    let date = moment().format("DD/MM/YYYY")
    let tomorrow = moment().add(1,"days").format("DD/MM/YYYY")
    let item = req.body
    let tracker = item.trackingNumber
    let agent = item.agentName
    let filter = {trackingNumber: tracker}
    let update = {
        status: "OUT FOR DELIVERY by " + agent + " at " + tomorrow,
        $push: {
            history: {
                statusDetail: "OUT FOR DELIVERY by " + agent + " at " + tomorrow, 
                dateUpdated: date,
                updateBy: req.body.username, 
                updateById: req.body.userID, 
                updateByPos: req.body.userPos
            }
        }
    }
    inventories.findOneAndUpdate(filter,update,(err,res) => {
        if(err) return alert(`Failed to update ${tracker} to POD`)
        else{
            deliScheduleDB.deleteOne(filter, (err)=> {
                console.log(filter)
                if(err) return alert(`Failed to removed ${tracker}.`)
                else{
                    alert(`${tracker} has been updated.`)
                }
            })
        }
    })
    let podOut = new podOutDB({
        trackingNumber: item.trackingNum,
        parcelNumber: item.parcelNumber,
        name: item.name,
        address: item.address,
        contact: item.contact,
        value: item.value,
        area: item.area,
        areaIndicator: item.areaIndicator,
        product: item.product,
        note: item.note,
        dateSchedule: date,
    })
    podOut.save((err)=> {
        if(err){
            console.log(err)
            alert(err)
        }
        else{
            alert(`${tracker} will be out for delivery at ${tomorrow} to ${agent}.`)
            res.status(204).send()
            res.end()
        }
    })
}

router.post("/outlist/:page/:limit", (req,res) => {
    if(req.body.formMETHOD === "ADD"){
        addToPod(req,res)
    }
    else if(req.body.formMETHOD === "REMOVED"){
        removedFromSchedule(req,res)
    }
    else{
        alert(`Failed to conduct both actions.`)
    }
})


/******************************************************************************************************************************************************************************/

router.post("/details", (req,res)=>{
    searchEngine(req,res)
})

function searchEngine(req,res){
    //let currentDetails = {}
    let startDate = moment(req.body.startDate).utcOffset('+0800').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //req.params.startTime = 2016-09-25 00:00:00
    let endDate   = moment(req.body.endDate).utcOffset('+0800').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //req.params.endTime = 2016-09-25 01:00:00

    console.log(startDate)
    console.log(endDate)
    //if query tracking number. use find({trackingNuember: value})
    inventories.find({
        entryDate: {
            $gt:  startDate,
            $lt:  endDate
        }
    }, function(err,details){
        currentDetails = details
            if(details){
                console.log(details)
                res.render('extractzalora',{
                    itemList: details,
                })
            }else{console.log("no tracking exist")}
        })
}

/*************************** USER *********************************/

router.get('/user', (req,res) => {
    userDB.find({}, function(err,users){
        res.render('userlist', {
            userList: users,
        })
    })
})

router.get('/register', (req,res) => {
    res.render('register')
})

router.post('/registerSuccess', (req,res) => {
    user(req,res)
})

router.get('/login', (req,res) => {
    res.render('login')
})

router.post('/dashboard', (req,res) => {
    login(req,res)
})


router.get('/changpassword', (req,res) => {
    res.render('changepassword')
})

router.post('/changesuccess', (req,res) => {
    firstTimeLogin(req,res)
})

router.get('/logout', (req,res) => {
    req.session.destroy()
    let time = moment().format()
    res.render('logout', {
        time: time,
    })
})

function user(req,res) {
    let body = req.body
    let name = body.name
    let ic = body.icNumber
    let user = new userDB ({
        name: body.name,
        password: body.password, //auto generated
        position: body.position, //admin,GRP,Warehouse,CS,Dispatch
        icNumber: body.icNumber,
        email: body.email,
        contact: body.contact,
        office: body.office,
        firstTime: "TRUE",
        create: body.create,
        update: body.update,
        delete: body.delete,
    })
    user.save((err) => {
        if (err){
            console.log(err)
            alert(err)
        }else {
            res.render ('success', {
                head: "Account Created",
                message: `Account for user ${name} successfuly created. Login ID ${ic}.`,
            })
        }
    })
}

function login(req,res){
    let icNumber = req.body.icNumber
    let password = req.body.password
    
    console.log(req.sessionID)
    userDB.authenticate(icNumber, password, (err, user) =>{
        if(req.session.authenticated){
            //res.json(req.session)
            console.log(req.session)
        }
        else{
            if (user){
                req.session.authenticated = true
                req.session.user = user
                currentUser = user
                //console.log(currentUser)
                console.log(user)
                //res.json(req.session)
                let firstTime = user.firstTime
                let position = user.position
                console.log(firstTime)
                if(firstTime === "TRUE"){
                    res.render('changepassword', {icNumber: icNumber})
                }
                else if (firstTime === "FALSE"){
                    if (position == "AD"){
                        inventories.find({}, (err,zaloraInventory) => {
                            dispatchDB.find({}, (err,dispatch) => {
                                res.render('dashboardad', {
                                    itemList: zaloraInventory,
                                    dispatch: dispatch,
                                    id: user._id,
                                    name: user.name,
                                    icNumber: user.icNumber,
                                    position: user.position,
                                    contact: user.contact,
                                    office: user.office
                                })
                            })
                        })
                        
                    }
                    else if (position == "TC"){
                        inventories.find({}, (err,zaloraInventory) => {
                            dispatchDB.find({}, (err,dispatch) => {
                                res.render('dashboardTc', {
                                    itemList: zaloraInventory,
                                    dispatch: dispatch,
                                    name: user.name,
                                    icNumber: user.icNumber,
                                    position: user.position,
                                    contact: user.contact,
                                    office: user.office
                                })
                            })
                        })
                        
                    }
                    else if (position == "CS"){
                        inventories.find({}, (err,zaloraInventory) => {
                            podDB.find({}, (err,pod) =>{
                                dispatchDB.find({}, (err,dispatch) => {
                                    res.render('dashboardWs', {
                                        itemList: zaloraInventory,
                                        dispatch: dispatch,
                                        podList: pod,
                                        name: user.name,
                                        icNumber: user.icNumber,
                                        position: user.position,
                                        contact: user.contact,
                                        office: user.office
                                    })
                                })
                            })
                        })
                    }
                    else if (position == "WS"){
                        inventories.find({}, (err,zaloraInventory) => {
                            dispatchDB.find({}, (err,dispatch) => {
                                res.render('dashboardWs', {
                                    itemList: zaloraInventory,
                                    dispatch: dispatch,
                                    name: user.name,
                                    icNumber: user.icNumber,
                                    position: user.position,
                                    contact: user.contact,
                                    office: user.office
                                })
                            })
                        })
                        
                    }
                    else if (position == "MW"){
                        inventories.find({}, (err,zaloraInventory) => {
                            dispatchDB.find({}, (err,dispatch) => {
                                res.render('dashboardWa', {
                                    itemList: zaloraInventory,
                                    dispatch: dispatch,
                                    name: user.name,
                                    icNumber: user.icNumber,
                                    position: user.position,
                                    contact: user.contact,
                                    office: user.office
                                })
                            })
                        })
                        
                    }
                    else if (position == "TW"){res.render('')}
                    else if (position == "FIN"){
                        inventories.find({}, (err,zaloraInventory) => {
                        podDB.find({}, (err,pod) =>{
                            dispatchDB.find({}, (err,dispatch) => {
                                res.render('dashboardfi', {
                                    itemList: zaloraInventory,
                                    dispatch: dispatch,
                                    podList: pod,
                                    name: user.name,
                                    icNumber: user.icNumber,
                                    position: user.position,
                                    contact: user.contact,
                                            office: user.office
                                        })
                                    })
                                })
                            })
                        }
                    else {res.render('error',{
                        code: 'Error Code: 1', //access control error
                        head:'Invalid Access',
                        message:'Failed to detect access for user',
                        solution: "Please inform RDI, EXT 877"
                    })}
                    
                }
                else{
                    res.render('error', {
                        code: 'Error Code: 401',
                        head:'Unauthorised Access.',
                        message:'Invalid access.',
                        solution: "Retry to login. If persist please contact RDI ext 877."
                    })
                }
            }
        }
    })
}

function firstTimeLogin(req,res){
    let filter = {icNumber: req.body.icNumber}
    console.log(filter)
    let password = req.body.password
    bcrypt.hash(password, 10, (err,hash) => {
        if(err) console.log(err)
        password = hash
        let update = {password: password, firstTime:"FALSE"}
        console.log(update)
        userDB.findOneAndUpdate(filter, update, (err,user) => {
            if(err){
                console.log(err)
                alert(err)
            } 
            else{
                alert(`Password Updated`)
                res.render('login')
            }
        })
    })   
}

/*************************** USER *********************************/

/*************************** ZALORA *********************************/
//use to get all zalora inventory list
router.get('/itemList', (req,res) => {
    inventories.find({}, function(err,inventory){
        res.render('itemList', {
            itemList: inventory,
            moment: moment
        })
    })
})

router.get('/list/:page/:limit', (req,res,next) => {
    var limit = req.params.limit || 10
    var page = req.params.page || 1

    inventories
        .find({})
        .sort({entryDate: -1})
        .skip((limit * page) - limit)
        .limit(limit)
        .exec(function(err, inventory) {
            inventories.count({}).exec(function(err, count) {
                if (err) return next(err)
                res.render('itemList1', {
                    itemList: inventory,
                    total: count,
                    current: page,
                    limit: limit,
                    name: currentUser.name,
                    icNumber: currentUser.icNumber,
                    position: currentUser.position,
                    pages: Math.ceil(count / limit)
                })
            })
        })
})

//Zalora In
router.get('/itemin', (req,res) => {
    res.render('itemin', {
        name: currentUser.name,
        icNumber: currentUser.icNumber,
        position: currentUser.position,
    })
    console.log(currentUser.position)
})

router.post('/itemin',(req,res) => {
    itemin(req,res)
})

//Zalora Out
router.get('/itemout',(req,res) => {
    res.render('itemout', {
        name: currentUser.name,
        icNumber: currentUser.icNumber,
        position: currentUser.position,
    })
})

router.post('/itemout',(req,res) => {
    itemOut(req,res)
})

router.get('/pod', (req,res) => {
    res.render('pod', {
        name: currentUser.name,
        icNumber: currentUser.icNumber,
        position: currentUser.position,
    })
})

router.post('/confirmpod', (req,res) => {
    pod(req,res)
})

router.get('/podList', (req,res) => {
    podDB.find({}, (err,pod) => {
        res.render('podList', {
            podList: pod,
        })
    })
})

//Zalora Re-Entry
router.get('/reentry', (req,res) => {
    res.render('reEntry', {
        name: currentUser.name,
        icNumber: currentUser.icNumber,
        position: currentUser.position,
    })
})

router.post('/reentryConfirm', (req,res) =>{
    reEntry(req,res)
})


//Zalora Export Return
router.get('/return', (req,res) => {
    let zaloraList = []
    inventories.find({} , (err,inventory) => {
        inventory.forEach(function(inventory){
            zaloraList.push(inventory)
        })
        res.render('return',{
            zalora: zaloraList,
            name: currentUser.name,
            icNumber: currentUser.icNumber,
            position: currentUser.position,
        })
    })
   
})

router.post('/success', (req,res) => {
    exportReturn(req,res)
})

//Zalora Self Collect
router.get('/selfcollect', (req,res) => {
    res.render('selfCollect', {
        name: currentUser.name,
        icNumber: currentUser.icNumber,
        position: currentUser.position,
    })
})

router.post('/confirmed', (req,res) => {
    let date = moment().format("DD/MM/YYYY, h:mm:ss a");
    let tracker = req.body.trackingNumber
    let filter = {trackingNumber: req.body.trackingNum}
    //console.log(req.body.trackingNum)
    //console.log(req.body.trackingNumber)
    let update = {status: "SELF COLLECTED " + "["+ req.body.csName +"]" + " at " + date, 
        $push:{
            history: {
                statusDetail: "SELF COLLECTED" + "["+ req.body.csName +"]", 
                dateUpdated: date,
                updateBy: req.body.username, 
                updateById: req.body.userID, 
                updateByPos: req.body.userPos
            }
        }
    }
    let option = {upsert: true, new: true}
    //console.log(req.body.trackingNum)
    //console.log(filter)
    inventories.findOneAndUpdate(filter, update, option, (err,docs) => {
        if(err){
            console.log(err)
            alert(`Failed to update ${tracker}`)
        } 
        else{
            console.log(docs)
            res.render('success')
        } 
    })
})

//This is used for return details >>>>> ADD USER <<<<<<
function exportReturn(req,res){
    let date = moment().format("DD/MM/YYYY, h:mm:ss a")
    let tracker = req.body.trackingNumber
    let filter = {trackingNumber: req.body.trackingNumber}
    let option = {upsert: true, new: true}
    let update = {
        status: "RETURN TO MY" + " at " + req.body.dateSchedule,
        $push: {
            history: {
                statusDetail: "RETURN TO MY" + " at " + req.body.dateSchedule,
                dateUpdated: date, 
                updateBy: req.body.username, 
                updateById: req.body.userID, 
                updateByPos: req.body.userPos
            }
        }
    }
    inventories.findOneAndUpdate(filter,update, option, (err,docs) => {
        if(err){
            console.log(err)
            alert(`Failed to update ${tracker}`)
        } 
        else {
            console.log('update success')
            let date = req.body.dateSchedule
            res.render('success',{
                head: "Tracking Number has been updated",
                message: `The tracking number has been reSchedule for delivery on ${date}`
            })
        }
    })
    let exports = req.body
    let exportReturn = new exportDB({
        trackingNumber: exports.trackingNumber,
        newTrackingNumber: exports.newTrackingNumber,
        name: exports.name,
        address: exports.address,
        contact: exports.contact,
        dateSchedule: exports.dateSchedule,
    })
    exportReturn.parcelContent.push(item)
    exportReturn.save((err) => {
        if (err){
            alert(err)
        }else {
            res.render ('success', {
                head: "Successfully save",
                message: " ",
            })
        }
    })
}


//reEntry parcels >>>>>>>>> ADD USER <<<<<<<<<<<<
function reEntry(req,res){
    let date = moment().format("DD/MM/YYYY, h:mm:ss a");
    let filter = {trackingNumber: req.body.trackingNumber}
    let update = {
        status: "IN WAREHOUSE" + "[" + req.body.reason + "]" + " Reschedule at " + req.body.dateSchedule,
        reason: req.body.reason,
        remark: req.body.remark,
        reEntry: "TRUE",
        reSchedule: req.body.dateSchedule,
        $push: {
            history: {
                statusDetail: "IN WAREHOUSE" + "[" + req.body.reason + "]" + " Reschedule at " + req.body.dateSchedule,
                dateUpdated: date, 
                updateBy: req.body.username, 
                updateById: req.body.userID, 
                updateByPos: req.body.userPos
            }
        }
    }
    let option = {upsert: true, new: true}
    inventories.findOneAndUpdate(filter,update,option, (err,docs) => {
        if(err){
            console.log(err)
            alert(err)
        } 
        else {
            console.log('update success')
            let date = req.body.dateSchedule
            res.render('success',{
                head: "Tracking Number has been updated",
                message: `The tracking number has been reSchedule for delivery on ${date}`
            })
        }
    })
}

//Item out into staging area
function itemOut(req,res){
    let status = {status: req.body.status}
    let date = moment().format("DD/MM/YYYY, h:mm:ss a")
    let tracker = {trackingNumber: req.body.trackingNum}
    let track = req.body.trackingNumber
    let update = {
        status: "SCHEDULE FOR DELIVERY " + " to " + req.body.agentName + " at " + date, 
        $push:{
            history: {
                statusDetail: "SCHEDULE FOR DELIVERY " + " to " + req.body.agentName , 
                dateUpdated: date,
                updateBy: req.body.username, 
                updateById: req.body.userID, 
                updateByPos: req.body.userPos
            }
        }
    }
    let option = {upsert: true, new: true}
    inventories.findOne(tracker, (err,result) => {
        let count = result.count
        //console.log(count)
        if (result){
            if(count == 0 || count <= 3) {
                let newcount = count + 1
                result.count = newcount
                result.save()
                console.log(newcount)
                //console.log(result.count)
            }
            else if (count >= 4){
                /*res.render('error', {
                    code: "9",
                    head: "Max delivery attempt reached",
                    message: "Parcel reach maximum number of attempts",
                    solution: "Please inform warehouse supervisor to schedule for return or inform customer to self collect the parcel.",
                })*/
                alert('Maximum delivery attempt reached. Please inform Warehouse supervisor or customer for self collection.')
                console.log("new" + count)
            }
        }
    })
    inventories.findOneAndUpdate(tracker,update,option,(err,docs) => {
        if(err){
            console.log(err)
            alert(`Failed to update ${track}`)
        } 
        else {
            console.log('update success')
           //let date = req.body.dateSchedule
            res.render('itemout',{
                name: currentUser.name,
                icNumber: currentUser.icNumber,
                position: currentUser.position,
            })
        } 
    })
}

//POD access by warehouse supervisor and transport controller
function pod(req,res){
    let body = req.body
    let date = moment().format("DD/MM/YYYY")
    let ref = "GR/POD/" + body.agentName + "[" + body.areaCode + "]" + "/" + date
    let tracker = body.trackingNumC
    console.log(tracker)
    for (let i = 0; i < tracker.length; i++){
        let filter = {trackingNumber: tracker[i]}
        let update = {
            status: "SCHEDULED FOR DELIVERY" + " at " + body.dateAssign, 
            $push: {
                history: {
                    statusDetail: "SCHEDULED FOR DELIVERY" + body.dateAssign, 
                    dateUpdated: date,
                    updateBy: req.body.username, 
                    updateById: req.body.userID, 
                    updateByPos: req.body.userPos 
                }
            }
        }
        let option = {upsert: true, new: true}
        console.log(filter)
        inventories.findOneAndUpdate(filter, update, option, (err,docs) => {
            if(err){
                console.log(err)
                alert(`Failed to update ${tracker}`)
            } 
            else {
                alert('Tracking number successfully updated.')
                console.log('update success')
               //let date = req.body.dateSchedule
            }
        })
    }
    let itemOut = new podDB({
        podRef: ref, //ref is auto generated by the system. To differentiate the products delivered
        podAssign: body.agentName,
        podDate: body.dateAssign,
        podTotal: body.value, //Total amount of cash to be collected.
        //podTotalParcel: body.parcel, //Total amount of parcel to be delivered.
        //podClass: body.type, //Class is to identify who will be delivering. Freelancer or Full Time. 
        podProduct: body.product, //Product is used to identify the delivered product.
        podArea: body.areaCode,
        podCreate: body.dateCreate,
        podMade: body.madeBy,
        podAgentId: body.agentID,
        trackingNum: body.trackingNumC,
        name: body.contactNameC,
        contact: body.phoneC,
        address: body.addressC,
        value: body.valueC,
    })
   console.log(body.trackingNumC)
    itemOut.save((err) => {
        if (err){
            console.log(err)
            alert(err)
        }else {
            res.render ('success', {
                head: "Task Assigned",
                message: "Task successfully assigned to <%=  body.assignTo %>.",
            })
        }
    })
}

//Item into warehouse
function itemin(req,res){
    let date = moment().format("DD/MM/YYYY, h:mm:ss a")
    let tracker = req.body.trackingNumber
    let parcelStatus = {
        statusDetail: "IN WAREHOUSE" + "[" +req.body.area + "]", 
        dateUpdated: date,
        updateBy: req.body.username, 
        updateById: req.body.userID, 
        updateByPos: req.body.userPos
    }
    let inventory = new inventories({
       trackingNumber: req.body.trackingNumber,
       parcelNumber: req.body.parcelNumber,
       patientNumber: req.body.patientNum,
       name: req.body.name,
       contact: req.body.contact,
       address: req.body.address,
       area: req.body.area,
       areaIndicator: req.body.areaLoc,
       task: req.body.taskCB,
       product: req.body.formMETHOD,
       value: req.body.value,
       status: "IN WAREHOUSE" + "[" + req.body.area + "]" + " at " + req.body.dateEntry,
       reEntry: "FALSE",
       reason: req.body.reason,
       remark: req.body.remark,
       note: req.body.note,
       attemp: "FALSE",
       reSchedule: req.body.reSchedule,
       dateArrive: req.body.dateArrive,
       dateEntry: req.body.dateEntry,
       userName: req.body.username,
       userID: req.body.userID,
       userPos: req.body.userPos,
       count: 0,
    })
    console.log(inventory)
    inventory.history.push(parcelStatus)
    inventory.save((err) => {
        if (err) {
            console.log(err)
            alert(err)
        }else {
            alert(`${tracker} successfully added into database`)
            res.redirect ('itemin')
        }
    })
}

/*************************** ZALORA *********************************/

/*************************** PHARMACY *********************************/

router.get('/pharmacyin',(req,res) => {
    res.render('comingsoon', {
        head: "Page in development",
        message: "Coming Soon"
    })
})

//Pharmacy In
function pharmacyIn (req,res){
    let parcelStatus = {
        statusDetail: "IN MED ROOM" + "[" +req.body.area + "]", 
        dateUpdated: date,
        updateBy: req.body.username, 
        updateById: req.body.userID, 
        updateByPos: req.body.userPos
    }
    let inventory = new inventories({
        trackingNumber: req.body.trackingNumber,
        parcelNumber: req.body.parcelNumber,
        patientNumber: req.body.patientNum,
        name: req.body.name,
        contact: req.body.contact,
        address: req.body.address,
        area: req.body.area,
        fridge: req.body.fridge,
        areaIndicator: req.body.areaLoc,
        task: req.body.taskCB,
        product: req.body.formMETHOD,
        value: req.body.value,
        status: "IN MED ROOM" + "[" + req.body.area + "]" + " at " + req.body.dateEntry,
        reEntry: "FALSE",
        reason: req.body.reason,
        remark: req.body.remark,
        note: req.body.note,
        attemp: "FALSE",
        reSchedule: req.body.reSchedule,
        dateArrive: req.body.dateArrive,
        dateEntry: req.body.dateEntry,
        userName: req.body.username,
        userID: req.body.userID,
        userPos: req.body.userPos,
        count: 0,
    })
    inventory.history.push(parcelStatus)
    inventory.save((err) => {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000){
                res.render('error', {
                    code: 'Mongo = 11000',
                    head:'Invalid Entry',
                    message:'Tracking Number already exist within the database'
                })
            }
        }else {
            res.redirect ('pharmain')
        }
    })
}

//GRP BN
function grpBN (req,res){
    let parcelStatus = {
        statusDetail: "IN WAREHOUSE" + "[" +req.body.area + "]", 
        dateUpdated: date,
        updateBy: req.body.username, 
        updateById: req.body.userID, 
        updateByPos: req.body.userPos
    }
    let inventory = new inventories({
        trackingNumber: req.body.trackingNumber,
        parcelNumber: req.body.parcelNumber,
        grpTrack: req.body.grpTrack,
        name: req.body.name,
        contact: req.body.contact,
        address: req.body.address,
        area: req.body.area,
        frigde: req.body.fridge,
        areaIndicator: req.body.areaLoc,
        task: req.body.taskCB,
        product: req.body.formMETHOD,
        value: req.body.value,
        status: "IN WAREHOUSE" + "[" + req.body.area + "]" + " at " + req.body.dateEntry,
        reEntry: "FALSE",
        reason: req.body.reason,
        remark: req.body.remark,
        note: req.body.note,
        attemp: "FALSE",
        reSchedule: req.body.reSchedule,
        dateArrive: req.body.dateArrive,
        dateEntry: req.body.dateEntry,
        userName: req.body.username,
        userID: req.body.userID,
        userPos: req.body.userPos,
        count: 0,
    })
    inventory.history.push(parcelStatus)
    inventory.save((err) => {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000){
                res.render('error', {
                    code: 'Mongo = 11000',
                    head:'Invalid Entry',
                    message:'Tracking Number already exist within the database'
                })
            }
        }else {
            res.redirect ('pharmain')
        }
    })
}

module.exports = router;
