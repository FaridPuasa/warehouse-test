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

let currentUser = {}

//exporting data from mongo to csv

router.get("/cs", (req,res)=>{
    inventories.find({}, function(err,inventory){
        res.render('newlist', {
            itemList: inventory,
            moment: moment
        })
    })
})

router.get('/datey', (req,res) => {
    res.render('testdate')
})

router.post('/date', (req,res) => {
    let date = moment(req.body.startDate).format('DD/MM/YYYY')
    console.log(req.body.startDate)
    console.log(date)
})

router.get('/outlist', (req,res) => {
    inventories.find({}, function(err,inventory){
        res.render('Listtoschedule', {
            itemList: inventory,
            moment: moment
        })
    })
})
/*************************************************************** VERSION 2 ************************************************************************** */
router.post("/listForOut", (req,res) => {
    addToItemOut(req,res)
})

function addToItemOut(req,res){
    let item = req.body
    let date = moment().format("DD/MM/YYYY")
    let agent = "TEST"
    let tracker = item.trackingNumber
    let filter = {trackingNumber: tracker}
    let update = {
        status: "SCHEDULE FOR DELIVERY by " + agent + " at " + date,
        $push: {
            history:{
                statusDetail: "SCHDULE FOR DELIVERY" + "[" + req.body.agentName + "]" , 
                dateUpdated: date,
                updateBy: req.body.userName, 
                updateById: req.body.userID, 
                updateByPos: req.body.pos
            }
        }
    }
    //let option = {upsert: true, new: true}
    let status = req.body.status
    console.log(filter)
    console.log(update)
    inventories.find(filter,update,(err,result) => {
        if(err){
            console.log(err)
            alert(`Failed to update ${tracker}.`)
        }else{
            console.log(result)
        }
    })
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
            alert(`
            Error Code: 4
            Failed to add ${tracker} to list.
            `)
        }
        else{
            alert(`${tracker} has been schedule for delivery at ${date} to ${agent}.`)
        }
    })
}

router.post("/schedulelist", (req,res) => {
    findScheduleList (req,res)
})

function findScheduleList (req,res){
    let agent = req.body.agentName
    let date = req.body.dateSchedule
    deliScheduleDB.find({}, (err,list) => {
        if (agent == list.agentName && date == list.dateSchedule){
            res.render('schlist',{
                scheduleList: list,
                name: currentUser.name,
                icNumber: currentUser.icNumber,
                position: currentUser.position,
            })
        }
        else{
            alert(`No List available`)
        }
    })
}

router.get('/itemoutsss', (req,res) => {
    getItemOut(req,res)
})

function getItemOut(req,res){
    inventories.find({},(err,outlist) => {
        res.render('itemout', {
            itemList: outlist
        })
    })
}

function removedFromSchedule(req,res){
    let item = req.body
    let tracker = item.trackingNum
    let filter = {trackingNumber: item.trackingNum}
    let update = {
        status: "IN WAREHOUSE" + "[" +req.body.area + "]",
        $push: {
            history:{
                statusDetail: "IN WAREHOUSE" + "[" +req.body.area + "]" , 
                dateUpdated: date,
                updateBy: req.body.userName, 
                updateById: req.body.userID, 
                updateByPos: req.body.pos
            }
        }
    }
    inventories.find(filter,update,option, (err,result) => {
        if(err){
            alert(`Failed to update ${tracker}`)
        }
        else{
            deliScheduleDB.remove(filter, (err)=> {
                if(err){
                    alert(`Failed to removed ${tracker}`)
                }
                else{
                    res.render('scheduleList', {

                    })
                }
            })
        }
    })
}

function addToPod(req,res){
    let date = moment().format()
    let item = req.body
    let tracker = item.trackingNumber
    let agent = item.agentName
    let filter = {trackingNumber: item.tracker}
    let update = {
        status: "OUT FOR DELIVERY at " + date + " by " + agent,
        $push: {
            history: {
                statusDetail: "OUT FOR DELIVERY at " + date + " by " + agent , 
                dateUpdated: date,
                updateBy: req.body.userName, 
                updateById: req.body.userID, 
                updateByPos: req.body.pos
            }
        }
    }
    inventories.findOneAndUpdate(filter,update,option, (err,result) => {
        if(err){
            alert(`Failed to update ${tracker}.`)
        }
        else{
            alert(`${tracker} has been successfully update.`)
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
            alert(`${tracker} this parcel has been added into the list.`)
        }
        else{
            res.render('out')
        }
    })
}


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

function csvExport(req,res) {
    let dateStart = req.body.dateStart
    let dateEnd = req.body.dateEnd

    const transformer = (doc)=> {
        return {
            trackingNumber: doc.trackingNumber,
            parcelNumber: doc.parcelNumber,
            name: doc.name,
            contact: doc.contact,
            address: doc.address,
            area: doc.area,
            areaIndicator: doc.areaIndicator,
            product: doc.product,
            value: doc.value,
            reEntry: doc.reEntry,
            attemp: doc.attemp,
            count: doc.count,
            dateEntry: doc.dateEntry,
            entryDate: doc.entryDate,
            expireDate:doc.expireDate,
            status: doc.status,
            userName: doc.userName,
            userPos: doc.userPos,
        };
    }

    const filename = 'export.csv';
    const cursor = inventories.find()

    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.writeHead(200, { 'Content-Type': 'text/csv' });
    res.flushHeaders();
    var csvStream = fastCsv.format({headers: true}).transform(transformer)
    cursor.stream().pipe(csvStream).pipe(res);
}


router.get('/acess/zalora', (req,res)=> {
    inventories.find({}, function(err,inventory){
        res.render('zalora', {
            itemList: inventory,
            moment: moment
        })
    })
})

//test for checkbox
router.get("/testing", (req,res) => {
    res.render("tester")
})

router.post("/testcomplete", (req,res) => {
    let testCB = req.body.selected
    if (testCB == "true"){
        testCB = true
        console.log(req.body.trackingNum)
        console.log("the box is check and true")
        res.render("testcomplete", {
            testCB: testCB,
        })
    }
    else if (testCB == undefined){
        testCB = false
        console.log(testCB)
        console.log("the box is uncheck and false")
        res.render("testcomplete", {
            testCB: testCB,
        })
    }
    console.log(req.body.testCB)
})


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

router.get('/poddispatcher', (req,res) => {
    res.render('podDispatch')
})

router.get('/logout', (req,res) => {
    req.session.destroy()
    let time = moment().format()
    res.render('logout', {
        time: time,
    })
})

function userEditable(req,res){
    let body = req.body
    let filter = {icNumber: body.icNumber}
    let update = {position: body.position, email: body.email, contact: body.contact, office: body.office, create: body.create, update: body.update, delete: body.delete}
    let option = {upsert: true, new: true}
    userDB.findOneAndUpdate(filter,update,option, (err,result) => {
        if (err){
            console.log(err)
            res.render('error', {
                code: '11000',
                head:'Invalid Entry',
                message:'User IC-Number / Social Security Number already in Database'
            })
            if (err.name === 'MongoError' && err.code === 11000){
                res.render('error', {
                    code: '11000',
                    head:'Invalid Entry',
                    message:'User IC-Number / Social Security Number already in Database'
                })
            }
        }else {
            console.log("Update Success")
        }
    })
}

function userAttendance(req,res){
    let dateTime = moment().format("DD/MM/YYYY")
    let body = req.body
    let filter = {icNumber: body.icNumber}
    let update = {$push: {attendance:{clockIn: dateTime, clockOut: dateTime}}}
    let option = {upsert: true, new: true}
    userDB.findOneAndUpdate(filter,update,option, (err,result) => {
        if (err){
            console.log(err)
            res.render('error', {
                error_code: 'Error Code: 10',
                head:'Invalid Entry',
                message:'User IC-Number / Social Security Number already in Database'
            })
            if (err.name === 'MongoError' && err.code === 11000){
                res.render('error', {
                    error_code: '11000',
                    head:'Invalid Entry',
                    message:'User IC-Number / Social Security Number already in Database'
                })
            }
        }else {
            console.log("Update Success")
        }
    })
}

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
            res.render('error', {
                code: 'Mongo = 11000',
                head:'Invalid Entry',
                message:'User IC-Number / Social Security Number already in Database',
                solution: 'Retry registration. If persist please contact RDI ext 877'
            })
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
                    else if (position == "DIS"){
                        dispatchDB.find({}, function(err,dispatch) {
                            res.render('dashboardDis', {
                                dispatch: dispatch,
                                name: user.name,
                                icNumber: user.icNumber,
                                position: user.position,
                                contact: user.contact,
                                office: user.office,
                            })
                        })  
                    }
                    else if (position == "DIS-EFR"){
                        dispatchDB.find({}, function(err,dispatch) {
                            res.render('dashboardDIS', {
                                dispatch: dispatch,
                                name: user.name,
                                icNumber: user.icNumber,
                                position: user.position,
                                contact: user.contact,
                                office: user.office,
                            })
                        })  
                    }
                    else if (position == "FIN"){res.render('')}
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
                res.render('error',{
                    head: "Error",
                    code: "10",
                    message: "Failed to Update Password",
                    solution: "Please contact RDI Department ext 877"
                })
            } 
            else{
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

router.get('/pew/:page-:limit', (req,res,next) => {
    var limit = req.params.limit || 10
    var page = req.params.page || 1

    inventories
        .find({})
        .skip((limit * page) - limit)
        .limit(limit)
        .exec(function(err, inventory) {
            inventories.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('itemList1', {
                    itemList: inventory,
                    current: page,
                    limit: limit,
                    pages: Math.ceil(count / limit)
                })
            })
        })
        console.log(page)
})

router.get('/itemListHistory/:page', (req,res,next) => {
    var perPage = 10
    var page = req.params.page || 1

    inventories
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, inventory) {
            inventories.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('teslist', {
                    itemList: inventory,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
       
})



router.get('/dispatcher-report', (req,res) => {
    dispatchDB.find({}, function(err,dispatch) {
        res.render('dispatchreport', {
            dispatch: dispatch,
        })
    })
})

/*router.get('/',(req,res) => {
    inventories.find({}, function(err,inventory){
        res.render('test', {
            itemList: inventory,
            moment: moment
        })
    })
})*/

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

router.get('/personalPod', (req,res) => {
    podDB.find({}, (err,pod) => {
        res.render('podListPvt', {
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

//Zalora Dispatcher Report
router.get('/dispatch',(req,res) => {
    res.render('dispatch', {
        name: currentUser.name,
        icNumber: currentUser.icNumber,
        position: currentUser.position,
    })
})

router.post('/dispatchSuccess', (req,res) => {
    dispatcherRecord(req,res)
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

router.post('/edit', (req,res) => {
    console.log(req.body.trackingNum)
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
    let date = moment().format("DD/MM/YYYY");
    let filter = {trackingNumber: req.body.trackingNum}
    console.log(req.body.trackingNum)
    console.log(req.body.trackingNumber)
    let update = {status: "SELF COLLECTED " + "["+ req.body.csName +"]" + " at " + date, 
        $push:{
            history: {
                statusDetail: "SELF COLLECTED" + "["+ req.body.csName +"]", 
                dateUpdated: date,
                updateBy: req.body.userName, 
                updateById: req.body.userID, 
                updateByPos: req.body.pos
            }
        }
    }
    let option = {upsert: true, new: true}
    console.log(req.body.trackingNum)
    console.log(filter)
    inventories.findOneAndUpdate(filter, update, option, (err,docs) => {
        if(err){
            console.log(err)
            res.render('error',{
                head: "Error",
                code: "10",
                message: "Failed to update database",
                solution: "Please contact RDI Department ext 877"
            })
        } 
        else{
            console.log(docs)
            res.render('success')
        } 
    })
})


//This is used for return details >>>>> ADD USER <<<<<<
function exportReturn(req,res){
    let date = moment().format("DD/MM/YYYY")
    let filter = {trackingNumber: req.body.trackingNumber}
    let update = {status: "RETURN TO MY"}
    let option = {upsert: true, new: true}
    let history = {history: {statusDetail: "RETURN TO MY"}}
    inventories.findOneAndUpdate(filter,{$push: history}, option, (err,docs) => {
        if(err){
            console.log(err)
            res.render('error',{
                head: "Error",
                code: "10",
                message: "Failed to update database",
                solution: "Please contact RDI Department ext 877"
            })
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
    inventories.findOneAndUpdate(filter,update, option, (err,docs) => {
        if(err){
            console.log(err)
            res.render('error',{
                head: "Error",
                code: "10",
                message: "Failed to update database",
                solution: "Please contact RDI Department ext 877"
            })
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
            res.render('error', {
                code: 'Mongo = 11000',
                head:'Invalid Entry',
                message:'Tracking Number already exist within the database', 
                solution: 'Retry entering database. If persist please contact RDI ext 877'
            })
        }else {
            res.render ('success', {
                head: "Successfully save",
                message: " ",
            })
        }
    })
}

//This is use for dispatcher to check their POD
function dispatcherPod(req,res){
    let body = req.body
    let date = moment().format("DD/MM/YYYY")
    let tracker = body.trackingNum
    let update = {status: "COMPLETED" + " at " + date, $push: {history: {statusDetail: "COMPLETED", dateUpdated: date,}}}
    let option = {upsert: true, new: true}
    for (i = 0; i< tracker.length; i++){
        let filter = {trackingNumber: tracker[i], task: true}
        inventories.findOneAndUpdate(filter, update, option)
    }
}

//This is use for end of day report
function dispatcherRecord(req,res){
    let dispatch = req.body
    let date = moment().format("DD/MM/YYYY")
    let ref = "GR/Dispatch/" + dispatch.name + date
    let dispatcher = new dispatchDB({
        ref: ref,//Auto generate
        name: dispatch.name,
        userID: dispatch.userID,
        carNumber: dispatch.car,
        given: dispatch.parcel, //Total Number of parcel given
        unattempted: dispatch.unattempt,
        success: dispatch.success, //Total Number of parcel success
        selfCollect: dispatch.selfCollect, //Total Number of parcel changed to selfcollect
        failed: dispatch.failed, //Total Number of parcel failed
        reSchedule: dispatch.reSchedule, //Total Number of parcel re-schedule
        cancel: dispatch.cancel, //Total Number of parcel cancel
        pickup: dispatch.pickup, //Radio yes or no
        pickupVal: dispatch.pickupValue, //Total amount of pickup
        pickupTN: dispatch.pickupTN, //Textarea
        return: dispatch.return, //radio yes or no
        returnVal: dispatch.returnValue, //total number of return parcel
        returnTN: dispatch.returnN, //Textarea
        totalCollected: dispatch.collection, //Amount of cash collected
        dateSubmit: dispatch.dateSubmit,
    })
    dispatcher.save((err) => {
        if (err){
            res.render('error', {
                code: 'Mongo = 11000',
                head:'Invalid Entry',
                message:'Tracking Number already exist within the database', 
                solution: 'Retry submitting the form again. If persist please contact RDI ext 877'
            })
        }else {
            res.render ('success', {
                head: "Task Assigned",
                message: `Task successfully assigned to ${s}.`,
            })
        }
    })
}

//reEntry parcels >>>>>>>>> ADD USER <<<<<<<<<<<<
function reEntry(req,res){
    let date = moment().format("DD/MM/YYYY");
    let filter = {trackingNumber: req.body.trackingNumber}
    let history = {
        history: {
            statusDetail: "IN WAREHOUSE" + "[" + req.body.reason + "]",
            dateUpdated: date, 
            updateBy: req.body.userName, 
            updateById: req.body.userID, 
            updateByPos: req.body.pos
        }
    }
    let update = {
        status: "IN WAREHOUSE" + "[" + req.body.reason + "]" + " at " + date,
        reason: req.body.reason,
        remark: req.body.remark,
        reEntry: "TRUE",
        reSchedule: req.body.dateSchedule,
    }
    let option = {upsert: true, new: true}
    inventories.findOneAndUpdate(filter, {$push: history}, option, (err,docs) => {
        if(err){
            console.log(err)
            res.render('error',{
                head: "Error",
                code: "10",
                message: "Failed to update database",
                solution: "Please contact RDI Department ext 877"
            })
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
    inventories.findOneAndUpdate(filter,update,option, (err,docs) => {
        if(err){
            console.log(err)
            res.render('error',{
                head: "Error",
                code: "10",
                message: "Failed to update database",
                solution: "Please contact RDI Department ext 877"
            })
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
    let date = moment().format("DD/MM/YYYY")
    let tracker = {trackingNumber: req.body.trackingNum}
    let update = {
        status: "SCHEDULE FOR DELIVERY " + " to " + req.body.agentName + " at " + date, 
        $push:{
            history: {
                statusDetail: "SCHEDULE FOR DELIVERY " + " to " + req.body.agentName , 
                dateUpdated: date,
                updateBy: req.body.userName, 
                updateById: req.body.userID, 
                updateByPos: req.body.pos
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
            res.render('error',{
                head: "Error",
                code: "10",
                message: "Failed to update database",
                solution: "Please contact RDI Department ext 877"
            })
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

router.get("/test", (req,res) => {
    inventories.find({}, function(err,inventory){
        res.render('testpod', {
            itemList: inventory,
        })
    })
})

function editableList(req,res){
    let body = req.body
    let filter = {trackingNumber: req.body.trackingNumber}
    let update = {name: req.body.name, address: req.body.address, contact: req.body.contact,}
    let option = {upsert: true, new: true}
    inventories.findOneAndUpdate(filter,update,option,(err,docs) => {
        if(err){
            console.log(err)
            alert("Error to update Database!. Please contact ext 877")
        } 
        else {
            console.log('update success')
            alert("Update sucess!")
           //let date = req.body.dateSchedule 
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
                    statusDetail: "SCHEDULED FOR DELIVERY", 
                    dateUpdated: date,
                    updateBy: req.body.userName, 
                    updateById: req.body.userID, 
                    updateByPos: req.body.pos 
                }
            }
        }
        let option = {upsert: true, new: true}
        console.log(filter)
        inventories.findOneAndUpdate(filter, update, option, (err,docs) => {
            if(err){
                console.log(err)
                res.render('error',{
                    head: "Error",
                    code: "10",
                    message: "Failed to update database",
                    solution: "Please contact RDI Department ext 877"
                })
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
            if (err.name === 'MongoError' && err.code === 11000){
                res.render('error', {
                    error_code: '11000',
                    head:'Invalid Entry',
                    message:'Tracking Number already exist within the database'
                })
            }
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
    let date = moment().format('DD/MM/YYYY')
    let parcelStatus = {
        statusDetail: "IN WAREHOUSE" + "[" +req.body.area + "]", 
        dateUpdated: date,
        updateBy: req.body.userName, 
        updateById: req.body.userID, 
        updateByPos: req.body.pos
    }
    let bin = req.body.area +"/"+req.body.dateEntry
    let inventory = new inventories({
       trackingNumber: req.body.trackingNumber,
       parcelNumber: req.body.parcelNumber,
       name: req.body.name,
       contact: req.body.contact,
       address: req.body.address,
       area: req.body.area,
       areaIndicator: req.body.areaLoc,
       task: req.body.taskCB,
       product: req.body.formMETHOD,
       value: req.body.value,
       status: "IN WAREHOUSE" + "[" + req.body.area + "]" + " at " + req.body.dateEntry,
       bin: bin,
       reEntry: "FALSE",
       reason: req.body.reason,
       remark: req.body.reason,
       attemp: "FALSE",
       reSchedule: req.body.reSchedule,
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
            res.render('error', {
                code: 'Mongo = 11000',
                head:'Invalid Entry',
                message:'Tracking Number already exist within the database',
                solution: 'Please recheck on item list. If persist please contact RDI ext 877'
            })
        }else {
            res.redirect ('itemin')
        }
    })
}

function selfCollect(req,res){
    
}
/*************************** ZALORA *********************************/

/*************************** PHARMACY *********************************/

router.get('/pharmacyin',(req,res) => {
    res.render('comingsoon', {
        head: "Page in development",
        message: "Coming Soon"
    })
})

router.post("/pharmacyin",(req,res) => {
    pharmacyIn(req,res)
})

router.get('/pharmacyout',(req,res) => {
    res.render('comingsoon', {
        head: "Page in development",
        message: "Coming Soon"
    })
})

router.get('pharmacySelf',(req,res) => {
    res.render('pharmacyself')
})

router.get('pharmacySelf',(req,res) => {
    pharmaSelfCollect(req,res)
})

//Pharmacy In
function pharmacyIn (req,res){
    let parcelStatus = {statusDetail: "IN MED ROOM"+"["+req.body.area+"]"+ "at " + req.body.dateEntry}
    let bin = req.body.area +"/"+req.body.dateEntry
    let inventory = new inventories({
       trackingNumber: req.body.trackingNumber,
       parcelNumber: req.body.parcelNumber + "[" + req.body.area + "]",
       name: req.body.name,
       contact: req.body.contact,
       address: req.body.address,
       area: req.body.area,
       product: req.body.formMETHOD,
       value: req.body.value,
       status: "IN MED ROOM" + "[" + req.body.area + "]",
       bin: bin,
       reEntry: "FALSE",
       reason: req.body.reason,
       remark: req.body.reason,
       attemp: "FALSE",
       reSchedule: req.body.reSchedule,
       dateEntry: req.body.dateEntry,
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

//Self Collect Pharmacy
function pharmaSelfCollect(req,res){
    let date = moment().format("DD/MM/YYYY");
    let filter = {trackingNumber: req.body.trackingNumber}
    let update = {status: "SELF COLLECTED" + " at " + date}
    let history = {history: {statusDetail: "SELF COLLECTED" + " at " + date}}
    let option = {upsert: true, new: true}
    console.log(req.body.trackingNumber)
    inventories.findOneAndUpdate(filter,{$push: history}, option)
    inventories.findOneAndUpdate(filter, update, option, (err,docs) => {
        if(err){
            console.log(err)
            res.render('error',{
                head: "Error",
                code: "10",
                message: "Failed to update database",
                solution: "Please contact RDI Department ext 877"
            })
        } 
        else{
            console.log(docs)
            res.render('success', {
                head: `successfully update the warehouse management system`,
                message: `Item collected at ${date}`
            })
        } 
    })
}

/*************************** PHARMACY *********************************/

/*************************** GO RUSH MALAYSIA *********************************/
router.get('/grpmy',(req,res) => {
    res.render('comingsoon', {
        head: "Page in development",
        message: "Coming Soon"
    })
})


//Chances of Tookan to push accurately....?
//Does Tookan able to push to Mongo???
//Does DHL Require to Download???

//After DHL Pickup
function iteminMy(req,res){
    let date = moment().format("DD/MM/YYYY")
    let parcelStatus = "IN WAREHOUSE[MY]" + " at " + date
    let body = req.body
    let myInventory = new myInventoryDB ({
        trackingNumber: body.trackingNumber,
        name: body.name,
        address: body.address,
        contact: body.contact,
        value: body.value,
        stasus: "IN WAREHOUSE[MY]",
        product: body.formMETHOD,
        tag: body.tag,
        dateArrive: body.dateArrive,
    }) 
    myInventory.history.push(parcelStatus)
    myInventory.save((err) => {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000){
                res.render('error', {
                    error_code: '11000',
                    head:'Invalid Entry',
                    message:'Tracking Number already exist within the database'
                })
            }
        }else {
            res.redirect ('myin')
        }
    })
}

//Item Out for Transit to BN
function manifest(req,res){
    //let date = moment().format()
    //let parcelStatus = "IN TRANSIT TO BN" + " | " + date
    //let history = {history: {statusDetail: "SELF COLLECTED" + " | " + date}}
    let manifestList = []
    myInventoryDB.find({}, (err,results) => {
        results.forEach((result) => {
            if(result.something == "something"){
                myInventoryDB.push(result)
            }
        })
    })
}


/*************************** GO RUSH MALAYSIA *********************************/

router.get('/tracking',(req,res) => {
    res.render('comingsoon', {
        head: "Page in development",
        message: "Coming Soon"
    })
})

router.get('/central',(req,res) => {
    res.render('comingsoon', {
        head: "Page in development",
        message: "Coming Soon"
    })
})

module.exports = router;
