const express = require('express');
const {makePayment, verifyPayment} = require('../controllers/paystackController')

const route = express.Router();

route.post('/donate',makePayment );
route.post('/paystack/verify-payment', verifyPayment);

module.exports = route;