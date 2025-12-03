import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Health check response
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Edu-Hub Data Connect Email Service',
      domain: 'gigadata.store',
    }),
  };
};

