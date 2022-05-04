const mongoose = require("mongoose");

const reqString = {
    type: String,
    require: true,
}



const exportsSchema  = new mongoose.Schema({
    trackingNumber: reqString,
    newTrackingNumber: reqString,
    name: reqString,
    address: reqString,
    contact: reqString,
    dateSchedule: reqString,
    uid:{type:[String]},
})

module.exports = mongoose.model('exportss', exportsSchema)