const express = require('express');
const router = express.Router();
const moment = require('moment')
const bcrypt = require('bcrypt')
const alert = require('alert');

//Models listing

const inventories = require('../models/inventories');
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

//Item into warehouse function
function itemin (req,res) {
    let date = moment().format('DD/MM/YYYY')
    let itemin = req.body
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
} 

function itemout(req,res){
    let date = moment().format("DD/MM/YYYY")
    let tracker = {trackingNumber: req.body.trackingNum}
    let status = {status: "SCHEDULE FOR DELIVERY"}
    let update = {
        status: "OUT FOR DELIVERY " + "[" + req.body.agentName + "]" + " at " + date, 
        $push:{
            history: {
                statusDetail: "OUT FOR DELIVERY" + "[" + req.body.agentName + "]" , 
                dateUpdated: date,
                updateBy: req.body.userName, 
                updateById: req.body.userID, 
                updateByPos: req.body.pos
            }
        }
    }
    let option = {upsert: true, new: true}
    inventories.findOneAndUpdate(tracker,update,option,(err,docs) => {
        if(status != status && err){
            
        }
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
                alert(`Maximum delivery attempt reached. Please inform Warehouse supervisor or customer for self collection.`)
                console.log("new" + count)
            }
        }
    })
}

function pod(req,res){

}

function selfcollect(req,res){

}

function reentry(req,res){

}

function zalreturn(req,res){

}

function exportReturn(req,res){

}

function dispatch(req,res){

}





module.exports = router;
