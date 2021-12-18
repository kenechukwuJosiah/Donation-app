const express = require('express');
const {makePayment, verifyPayment, checkpaystack} = require('../controllers/paystackController')

const route = express.Router();

route.post('/donate',makePayment );
route.post('/paystack/callback', verifyPayment);

module.exports = route;