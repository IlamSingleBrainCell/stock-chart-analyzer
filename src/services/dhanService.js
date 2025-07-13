export const fetchDhanData = async (page = 1) => {
    const url = "https://ow-scanx-analytics.dhan.co/customscan/fetchdt";
    const headers = {
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
    };
    const body = {
        "data": {
            "sort": "Mcap",
            "sorder": "desc",
            "count": 50,
            "params": [
                { "field": "idxlist.Indexid", "op": "", "val": "13" },
                { "field": "Exch", "op": "", "val": "NSE" },
                { "field": "OgInst", "op": "", "val": "ES" }
            ],
            "fields": [
                "Sym",
                "Mcap",
                "High1Yr",
                "Low1Yr",
                "Pe",
                "ROCE",
                "PricePerchng1mon",
                "PricePerchng1year",
                "Sector",
                "sect_seo",
                "AnalystRating"
            ],
            "pgno": page
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Dhan API Error:', error);
        throw new Error(`Failed to fetch data from Dhan: ${error.message}`);
    }
};
