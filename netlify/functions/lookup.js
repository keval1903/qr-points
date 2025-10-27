// ============================================
// LOOKUP FUNCTION - Get product code from token
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
    // Get token from query params
    const token = event.queryStringParameters?.token;

    if (!token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Token is required' }),
      };
    }

    // Find product by token
    const product = await sheetsService.findProduct(token.trim());
    
    if (!product) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ success: false, message: 'Product not found' }),
      };
    }

    // Return product code
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          code: product.code,
          product: product.productName,
          category: product.category,
          points: product.points,
        },
      }),
    };

  } catch (error) {
    console.error('Lookup error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error. Please try again later.',
      }),
    };
  }
};
