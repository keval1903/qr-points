// ============================================
// REDEEM FUNCTION - Netlify Serverless
// ============================================

const sheetsService = require('./sheets-service');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const { code, name, phone } = JSON.parse(event.body);

    // Validate input
    if (!code || !code.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Product code is required' }),
      };
    }

    if (!name || !name.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Name is required' }),
      };
    }

    if (!phone || phone.length !== 10) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Valid 10-digit phone number is required' }),
      };
    }

    const cleanCode = code.trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    // Find product
    const product = await sheetsService.findProduct(cleanCode);
    
    if (!product) {
      await sheetsService.logAudit(cleanCode, cleanPhone, 'Invalid', 0);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ success: false, message: 'Invalid product code' }),
      };
    }

    // Check if already used
    const isUsed = await sheetsService.isCodeUsed(product.code, product.token);
    
    if (isUsed) {
      await sheetsService.logAudit(product.code, cleanPhone, 'Duplicate', product.points);
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ success: false, message: 'This code has already been redeemed' }),
      };
    }

    // Add to UsedQRs
    await sheetsService.addUsedQR(product, cleanName, cleanPhone);

    // Update customer points
    const currentCustomer = await sheetsService.getCustomerPoints(cleanPhone);
    const currentPoints = currentCustomer ? currentCustomer.points : 0;
    const newTotalPoints = currentPoints + product.points;
    
    await sheetsService.updateCustomerPoints(cleanPhone, cleanName, newTotalPoints);

    // Log success
    await sheetsService.logAudit(product.code, cleanPhone, 'Success', product.points);

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `${product.points} points added! Total: ${newTotalPoints}`,
        data: {
          code: product.code,
          product: product.productName,
          category: product.category,
          points: product.points,
          totalPoints: newTotalPoints,
        },
      }),
    };

  } catch (error) {
    console.error('Redemption error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error. Please try again later.',
        error: error
      }),
    };
  }
};
