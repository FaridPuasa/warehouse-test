const mongoose = require("mongoose");
const moment = require("moment");

const reqString = {
    type: String,
}

let date = moment().format();
let later = moment(date).add(21,'d')

let entryDate = {type: Date, default: date}
let expireDate = {type: Date, default: later}

const inventorySchema  = new mongoose.Schema({
    trackingNumber: {type: String, unique: true},
    parcelNumber: reqString,
    name: reqString,
    contact: reqString,
    address: reqString,
    area: reqString,
    areaIndicator: reqString,
    product: reqString,
    value: reqString,
    reason: reqString,
    remark: reqString,
    reEntry: reqString,
    attemp: reqString,
    count: {type: Number},
    reSchedule: reqString,
    dateEntry: reqString,
    entryDate: entryDate,
    expireDate:expireDate,
    status: reqString,
    task: reqString,
    userName: reqString,
    userID: reqString,
    userPos: reqString,
    history: [{statusDetail: reqString, dateUpdated: entryDate, updateBy: reqString, updateById: reqString, updateByPos: reqString}],
}, {timestamps: true})

//inventorySchema.index({createdAt: 1},{expireAfterSeconds: 60});//180 days
module.exports = mongoose.model('inventories', inventorySchema)


