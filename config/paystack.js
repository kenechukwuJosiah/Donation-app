const dotenv = require('dotenv').config();


module.exports = (request) => {
  const secret_key = process.env.PAYSTACK_MARCHANT_KEY;

  const initializePayment = (form, mycallback) => {
    const options = {
      uri: 'https://api.paystack.co/transaction/initialize',
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret_key}`,
        "Content-Type": "application/json",
      },
      form,
    };
    const callback = (err, response, body) => {
      return mycallback(err, body);
    };
    request(options, callback);
  };

  const verifyPayment = (ref, mycallback) => {
    const options = {
      uri: `https://api.paystack.co/transaction/verify/${ref}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret_key}`,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    };
    const callback = (err, response, body) => {
      return mycallback(err, body);
    };

    request(options, callback);
  };

  return { initializePayment, verifyPayment };
};
