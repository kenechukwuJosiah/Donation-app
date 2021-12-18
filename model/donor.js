const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  email: {type: String, required: true},
  amount: {type: Number, required: true},
  reference: {type: String, required: true}
})

const donorModel = mongoose.model('Donor', donorSchema);

module.exports = donorModel;
