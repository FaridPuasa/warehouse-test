const mongoose = require("mongoose");
const moment = require("moment");

const reqString = {
    type: String,
}

let date = moment().format("DD/MM/YYYY");

const delischeduleSchema  = new mongoose.Schema({
    trackingNumber: {type: String, unique: true},
    parcelNumber: reqString,
    name: reqString,
    contact: reqString,
    address: reqString,
    area: reqString,
    areaIndicator: reqString,
    product: reqString,
    value: reqString,
    dateSchdule: {type: Date, default: date},
})

module.exports = mongoose.model('schedules', delischeduleSchema)


