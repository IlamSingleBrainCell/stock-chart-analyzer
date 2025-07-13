const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const url = "https://ow-scanx-analytics.dhan.co/customscan/fetchdt";
    const body = event.body;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json; charset=UTF-8",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "Referer": "https://dhan.co/"
            },
            body: body,
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data' }),
        };
    }
};
