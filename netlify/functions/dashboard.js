// ============================================
// DASHBOARD FUNCTION - Netlify Serverless
// ============================================

const sheetsService = require('./sheets-service');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    // Get phone from query params
    const phone = event.queryStringParameters?.phone;

    // Validate input
    if (!phone || phone.length !== 10) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Valid 10-digit phone number is required' }),
      };
    }

    const cleanPhone = phone.trim();

    // Get customer data
    const customer = await sheetsService.getCustomerPoints(cleanPhone);
    
    if (!customer) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'No account found for this phone number. Scan a QR code to get started!',
        }),
      };
    }

    // Get redemption history
    const redemptions = await sheetsService.getCustomerRedemptions(cleanPhone);

    // Return dashboard data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          phone: customer.phone,
          name: customer.name,
          totalPoints: customer.points,
          redemptions: redemptions,
        },
      }),
    };

  } catch (error) {
    console.error('Dashboard error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
    };
  }
};
