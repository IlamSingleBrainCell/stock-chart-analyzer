const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: 'Missing "url" query parameter',
    };
  }

  try {
    const response = await fetch(decodeURIComponent(url));
    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};
