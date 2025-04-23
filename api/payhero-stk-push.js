const axios = require('axios');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const origin = isProduction
    ? 'https://payoneerinvestment.vercel.app'
    : 'http://localhost:3000';

  console.log('Received request:', req.method, req.body);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { phoneNumber, amount, reference } = req.body;
  console.log(`STK Push requested - Phone: ${phoneNumber}, Amount: ${amount}, Reference: ${reference}`);

  if (!phoneNumber || !amount || !reference) {
    return res.status(400).json({
      success: false,
      error: 'Missing phoneNumber, amount, or reference',
    });
  }

  const formattedPhone = phoneNumber.startsWith('0') ? `254${phoneNumber.slice(1)}` : phoneNumber;
  if (!/^(254[17]\d{8})$/.test(formattedPhone)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid phone number format. Use 07XXXXXXXX or 254XXXXXXXXX',
    });
  }

  const parsedAmount = Number(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Amount must be a positive number',
    });
  }

  try {
    const apiUsername = process.env.PAYHERO_API_USERNAME;
    const apiPassword = process.env.PAYHERO_API_PASSWORD;
    console.log('API Credentials:', {
      apiUsername,
      apiPassword: apiPassword ? '[REDACTED]' : undefined,
    });

    if (!apiUsername || !apiPassword) {
      throw new Error('Missing PayHero API credentials');
    }

    const authToken = `Basic ${Buffer.from(`${apiUsername}:${apiPassword}`).toString('base64')}`;

    const callbackUrl = isProduction
      ? `https://payoneerinvestment.vercel.app/api/payhero-callback`
      : process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/payhero-callback`
        : `http://localhost:3000/api/payhero-callback`;

    const payload = {
      amount: parsedAmount,
      phone_number: formattedPhone,
      channel_id: 1874,
      provider: 'm-pesa',
      external_reference: reference,
      callback_url: callbackUrl,
    };
    console.log('Sending to PayHero:', payload);

    const response = await axios.post(
      'https://backend.payhero.co.ke/api/v2/payments',
      payload,
      {
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    );

    console.log('PayHero response:', response.data);

    if (response.data.status === 'QUEUED' || response.data.success) {
      // Validate presence of CheckoutRequestID
      if (!response.data.CheckoutRequestID) {
        console.warn('PayHero response missing CheckoutRequestID:', response.data);
      }
      return res.status(200).json({
        success: true,
        reference: reference, // Client-provided reference
        payheroReference: response.data.reference || '', // PayHero's reference
        CheckoutRequestID: response.data.CheckoutRequestID || null, // PayHero's CheckoutRequestID
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
    return res.status(error.response?.status || 400).json({
      success: false,
      error: errorData.error_message || errorData.message || 'Failed to initiate STK Push',
    });
  }
};