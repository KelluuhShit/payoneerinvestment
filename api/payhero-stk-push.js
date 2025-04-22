// api/payhero-stk-push.js
const axios = require('axios');

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const origin = isProduction
    ? 'https://payoneerinvestment.vercel.app'
    : 'http://localhost:3000';

  // Log incoming request
  console.log('Received request:', req.method, req.body);

  // Handle CORS preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Restrict to POST
  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Extract and validate request body
  const { phoneNumber, amount, reference } = req.body;
  console.log(`STK Push requested - Phone: ${phoneNumber}, Amount: ${amount}, Reference: ${reference}`);

  if (!phoneNumber || !amount || !reference) {
    return res.status(400).json({
      success: false,
      error: 'Missing phoneNumber, amount, or reference',
    });
  }

  // Format and validate phone number
  const formattedPhone = phoneNumber.startsWith('0') ? `254${phoneNumber.slice(1)}` : phoneNumber;
  if (!/^(254[17]\d{8})$/.test(formattedPhone)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid phone number format. Use 07XXXXXXXX or 254XXXXXXXXX',
    });
  }

  // Validate amount
  const parsedAmount = Number(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Amount must be a positive number',
    });
  }

  try {
    // Load PayHero credentials
    const apiUsername = process.env.PAYHERO_API_USERNAME;
    const apiPassword = process.env.PAYHERO_API_PASSWORD;
    console.log('API Credentials:', {
      apiUsername,
      apiPassword: apiPassword ? '[REDACTED]' : undefined,
    });

    if (!apiUsername || !apiPassword) {
      throw new Error('Missing PayHero API credentials');
    }

    // Create auth token
    const authToken = `Basic ${Buffer.from(`${apiUsername}:${apiPassword}`).toString('base64')}`;

    // Set callback URL (use ngrok for local dev)
    const callbackUrl = isProduction
      ? `https://payoneerinvestment.vercel.app/api/payhero-callback`
      : process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/payhero-callback`
        : `http://localhost:3000/api/payhero-callback`; // Fallback, but won't work for PayHero

    // Prepare payload
    const payload = {
      phone_number: formattedPhone,
      amount: parsedAmount,
      reference,
      callback_url: callbackUrl,
    };
    console.log('Sending to PayHero:', payload);

    // Call PayHero API
    const response = await axios.post(
      'https://backend.payhero.co.ke/api/v2/stk-push',
      payload,
      {
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
        timeout: 15000, // Increased timeout
      }
    );

    console.log('PayHero response:', response.data);

    // Handle response
    if (response.data.status === 'QUEUED' || response.data.success) {
      return res.status(200).json({
        success: true,
        reference: response.data.reference || reference,
        message: 'STK Push initiated',
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'STK Push initiation failed',
        data: response.data,
      });
    }
  } catch (error) {
    const errorData = error.response?.data || { message: error.message };
    console.error('STK Push error:', JSON.stringify(errorData, null, 2));
    return res.status(500).json({
      success: false,
      error: errorData.error_message || error.message || 'An unexpected error occurred',
    });
  }
};