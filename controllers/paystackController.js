const request = require('request');
const Donor  = require('../model/donor');
const {initializePayment, verifyPayment} = require('../config/paystack')(request);

exports.makePayment = async (req, res) => {
  try {
    //Req body
    const {first_name, last_name, email, amount, } = req.body;
    
    const data = JSON.stringify({first_name, last_name, amount});
    const formData = {
      email,
      amount: amount * 100,
      metadata: data
    }
    //Initialize Paystack payment
    initializePayment(formData, (err, body) => {
      if(err){
        console.log(err);
        return res.status(500).json({
          code: 'E00',
          status: 'failed',
          message: 'Something went wrong processing payment'
        })
      }
      //Response body from request module
      const response = JSON.parse(body);
      
      //Check if response id successful
      if(response.status == 'false')return res.status(500).json({
        code: 'E02',
        status: 'Failed',
        message: 'Something went wrong processing payment'
      })

      //Returns res if successful
      return res.status(200).json({
        code: '00',
        status: 'success',
        data: response.data
      })
    })

  } catch (err) {
    //return Error res if error occurs
    console.log(err);
    return res.status(500).json({
      code: 'E01',
      status: 'Error',
      message: 'Error Occured While processing request'
    })
  }
}

exports.verifyPayment = async(req, res) => {
  try {
    // const ref = req.qurey.reference;
    const {ref} = req.body;
    //Verify Payment
    verifyPayment(ref, async(err, body) => {
      if(err){
        console.log(err)
        return res.status(500).json({
          code: 'E00',
          status: 'failed',
          message: 'Something went wrong processing payment'
        })
      }

      const response = JSON.parse(body);
      console.log(response);

      //Create a donor document in our db
      await Donor.create({first_name: response.first_name, last_name: response.last_name, amount: response.amount, email: response.email})

      return res.status(200).json({
        code: '00',
        status: 'success',
        message: 'Payment was successful'
      })
    })
  } catch (err) {
    console.log(err)
    //return Error res if error occurs
    return res.status(500).json({
      code: 'E01',
      status: 'Error',
      message: 'Error Occured While processing request'
    })
  }
};