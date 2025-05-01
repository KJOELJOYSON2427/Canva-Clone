const { application } = require("express");
const Subscription =require("../models/subscription");
const axios =require('axios');


const PAYPAL_API_URL = process.env.NODE_ENV === "production" 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com";

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";


async function getAccessToken(){
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const response = await axios({
        method: 'post',
        url: `${PAYPAL_API_URL}/v1/oauth2/token`,
        headers:{
            "Content-Type": 'application/x-www-form-urlencoded',
            Authorization: `Basic ${auth}`
        },
        data:'grant_type=client_credentials'
    })

return response.data.access_token;

}


// create paypal  order here


exports.createOrder = async (req, res) => {
  console.log("came");

  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_API_URL}/v2/checkout/orders`,
      headers: {
        "Content-Type": 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      data: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '500'
            },
            description: 'Canva Premium Membership'
          }
        ],
        application_context: {
          return_url: `${FRONTEND_URL}/subscription/success`,
          cancel_url: `${FRONTEND_URL}/subscription/cancel`
        }
      }
    });

    const order = response.data;
    const approvalLink = order.links.find((link) => link.rel === "approve")?.href;

    return res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        approvalLink
      }
    });

  } catch (e) {
    console.error("PayPal order creation error:", e?.message || e);
    return res.status(500).json({
      success: false,
      message: 'Error while creating PayPal order'
    });
  }
};


exports.capturePayment = async (req, res) => {

  try {
    console.log('comminhlfjf');
    
    const { userId } = req.user;  // Assuming the userId is fetched from a logged-in user (JWT, for example)
    const { orderId } = req.body;  // Ensure orderId is passed correctly in the body

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }

    // Get the access token
    const accessToken = await getAccessToken();

    // Make the request to capture the payment
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check for the capture data
    const captureData = response.data;
    const captureId = captureData.purchase_units[0].payments.captures[0].id;

    // Update the subscription in the database
    let subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      subscription = new Subscription({ userId });
    }

    subscription.isPremium = true;
    subscription.premiumSince = new Date();
    subscription.paymentId = captureId;

    // Save the subscription
    await subscription.save();

    return res.status(200).json({
      success: true,
      data: {
        isPremium: true,
        paymentId: captureId,
      },
    });
  } catch (e) {
    console.error('Error capturing payment:', e); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: 'Error while capturing PayPal order',
    });
  }
};

  exports.verifyPayment = async(req, res)=>{
    try{
  
    }catch(e){
      res.status(500).json({
          success:false,
              message:'Error while verifyPayment paypal order'
      })
    }
  }