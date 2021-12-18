const request = require("request");
const Donor = require("../model/donor");
const { initializePayment, verifyPayment } =
  require("../config/paystack")(request);

exports.makePayment = async (req, res) => {
  try {
    //Req body
    const { first_name, last_name, email, amount } = req.body;

    const data = JSON.stringify({ first_name, last_name, amount, email });
    const formData = {
      email,
      amount: amount * 100,
      metadata: data,
    };
    //Initialize Paystack payment
    initializePayment(formData, (err, body) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          code: "E00",
          status: false,
          message: "Something went wrong processing payment",
        });
      }
      //Response body from request module
      const response = JSON.parse(body);

      //Check if response id successful
      if (response.status === false)
        return res.status(500).json({
          code: "E02",
          status: true,
          message: "Something went wrong processing payment",
        });

      //Returns res if successful
      return res.status(200).json({
        code: "00",
        status: true,
        data: response.data,
      });
    });
  } catch (err) {
    //return Error res if error occurs
    console.log(err);
    return res.status(500).json({
      code: "E01",
      status: false,
      message: "Error Occured While processing request",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    // const ref = req.qurey.reference;
    const { ref } = req.body;
    console.log(ref);
    //Verify Payment
    verifyPayment(ref, async (err, body) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          code: "E00",
          status: false,
          message: "Something went wrong processing payment",
        });
      }

      const response = JSON.parse(body);

      if (response.status === false)
        return res
          .status(200)
          .json({ status: false, message: response.message });

      //Create a donor document in our db
      const {first_name, last_name, amount, email} = response.data.metadata;
      await Donor.create({first_name, last_name, amount, email, reference: ref})

      return res.status(200).json({
        code: "00",
        status: true,
        message: "Payment was successful",
        data: response.data
      });
    });
  } catch (err) {
    console.log(err);
    //return Error res if error occurs
    return res.status(500).json({
      code: "E01",
      status: "Error",
      message: "Error Occured While processing request",
    });
  }
};
