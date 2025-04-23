const axios = require('axios');

module.exports = async (req, res) => {
  const { reference } = req.query;
  console.log(`[${new Date().toISOString()}] Transaction status requested - Reference: ${reference}`);

  if (!reference) {
    console.log('Missing reference parameter');
    return res.status(400).json({ success: false, error: 'Missing reference' });
  }

  try {
    const apiUsername = process.env.PAYHERO_API_USERNAME;
    const apiPassword = process.env.PAYHERO_API_PASSWORD;
    if (!apiUsername || !apiPassword) {
      console.error('Missing PayHero API credentials');
      return res.status(500).json({ success: false, error: 'Server configuration error: Missing API credentials' });
    }
    const authToken = `Basic ${Buffer.from(`${apiUsername}:${apiPassword}`).toString('base64')}`;

    const response = await axios.get(
      `https://backend.payhero.co.ke/api/v2/transaction-status?reference=${reference}`,
      {
        headers: { Authorization: authToken, 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    const statusData = response.data;
    console.log(`PayHero transaction status response for ${reference}:`, JSON.stringify(statusData, null, 2));

    let normalizedStatus;
    if (!statusData || typeof statusData.status !== 'string') {
      console.warn(`Invalid PayHero response for ${reference}:`, statusData);
      normalizedStatus = 'QUEUED';
    } else if (statusData.status.toUpperCase() === 'SUCCESS') {
      normalizedStatus = 'SUCCESS';
    } else if (statusData.status.toUpperCase() === 'FAILED' && statusData.error_message?.toLowerCase().includes('cancel')) {
      normalizedStatus = 'CANCELLED';
    } else if (statusData.status.toUpperCase() === 'FAILED') {
      normalizedStatus = 'FAILED';
    } else if (statusData.status.toUpperCase() === 'CANCELLED') {
      normalizedStatus = 'CANCELLED';
    } else {
      normalizedStatus = 'QUEUED';
    }

    console.log(`Normalized status for ${reference}: ${normalizedStatus}`);
    res.json({
      success: true,
      status: normalizedStatus,
      data: statusData,
    });
  } catch (error) {
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data || null,
    };
    console.error(`Transaction status error for ${reference}:`, JSON.stringify(errorDetails, null, 2));
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.error_message || error.message || 'Failed to fetch transaction status',
    });
  }
};