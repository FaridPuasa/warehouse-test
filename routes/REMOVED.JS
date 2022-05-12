/*
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
}*/

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


router.post('/edit', (req,res) => {
    console.log(req.body.trackingNum)
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


router.get('/personalPod', (req,res) => {
    podDB.find({}, (err,pod) => {
        res.render('podListPvt', {
            podList: pod,
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

router.post('/editable', (req,res) => {

})


router.get('/dispatcher-report', (req,res) => {
    dispatchDB.find({}, function(err,dispatch) {
        res.render('dispatchreport', {
            dispatch: dispatch,
        })
    })
})


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

router.get('/poddispatcher', (req,res) => {
    res.render('podDispatch')
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

router.get('/datey', (req,res) => {
    res.render('testdate')
})

router.post('/date', (req,res) => {
    let date = moment(req.body.startDate).format('DD/MM/YYYY')
    console.log(req.body.startDate)
    console.log(date)
})
