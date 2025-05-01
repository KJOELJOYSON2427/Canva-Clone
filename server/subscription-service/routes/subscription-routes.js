const express = require("express");
const subscriptionController=require("../controller/subscription-controllers")
const paymentController=require("../controller/payment-controller")
const router = express.Router();
const authenticatedRequest = require("../src/middleware/auth-middleware");

router.use(authenticatedRequest);


router.get('/',subscriptionController.getSubscription);
router.post('/create-order',paymentController.createOrder);
router.post('/capture-order',paymentController.capturePayment);

module.exports = router;