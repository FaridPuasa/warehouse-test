const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const reqString = {
    type: String,
}

const podSchema  = new mongoose.Schema({
    podRef: {type: String},
    podArea: reqString,
    podDate: reqString,
    podTotal: reqString, //Total amount of cash to be collected.
    podTotalParcel: reqString, //Total amount of parcel to be delivered.
    podClass:reqString, //Class is to identify who will be delivering. Freelancer or Full Time. 
    podProduct: reqString, //Product is used to identify the delivered product.
    podCreate: reqString,
    podMade: reqString,
    trackingNum: {type: [String]},
    name: {type: [String]},
    contact: {type: [String]},
    address: {type: [String]},
    value: {type: [String]},
})

//module.exports = mongoose.model('contents', content)
module.exports = mongoose.model('pods', podSchema)
