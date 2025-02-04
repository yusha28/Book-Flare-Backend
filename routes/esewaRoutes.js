const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const router = express.Router();

const {
  ESEWA_MERCHANT_ID,
  ESEWA_SECRET_KEY,
  ESEWA_SUCCESS_URL,
  ESEWA_FAILURE_URL,
  ESEWA_API_URL
} = process.env;

// 🔹 Generate HMAC Signature
const generateHmacSignature = (message, secret) => {
  return crypto.createHmac('sha256', secret).update(message).digest('base64');
};

// 🔹 Initiate Payment
router.post('/initiate', async (req, res) => {
  try {
    const { total_amount, transaction_uuid, product_code } = req.body;

    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hmacSignature = generateHmacSignature(message, ESEWA_SECRET_KEY);

    const payload = {
      amount: total_amount,
      tax_amount: 0,
      total_amount: total_amount,
      amt:total_amount,
      txAmt:0,
      transaction_uuid: transaction_uuid,
      product_code: product_code,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: hmacSignature,
      success_url: ESEWA_SUCCESS_URL,
      failure_url: ESEWA_FAILURE_URL,
      psc:ESEWA_SUCCESS_URL,
      pdc:product_code,
      tAmt:total_amount,
    
    };

    res.json({ payment_url: `${ESEWA_API_URL}?${new URLSearchParams(payload).toString()}` });

  } catch (error) {
    console.error("❌ eSewa Payment Initiation Error:", error);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

// 🔹 Handle Payment Success
router.get('/payment-success', (req, res) => {
  const { transaction_uuid } = req.query;
  console.log("✅ Payment Successful! Transaction ID:", transaction_uuid);
  res.redirect(`http://localhost:3000/payment-success?txn=${transaction_uuid}`);
});

// 🔹 Handle Payment Failure
router.get('/payment-failure', (req, res) => {
  console.error("❌ Payment Failed!");
  res.redirect("http://localhost:3000/payment-failed");
});

module.exports = router;
