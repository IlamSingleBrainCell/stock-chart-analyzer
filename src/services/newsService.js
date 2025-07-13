import { MARKETAUX_API_KEY, MARKETAUX_BASE_URL } from '../constants';

export const fetchStockNews = async (symbol) => {
    if (!symbol) return;
    try {
        const url = `${MARKETAUX_BASE_URL}?api_token=${MARKETAUX_API_KEY}&symbols=${symbol}&language=en&limit=5&filter_entities=true`;
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData?.error?.message || `Failed to fetch news for ${symbol}. Status: ${response.status}`;
            throw new Error(errorMessage);
        }
        const rawData = await response.json();
        if (rawData && rawData.data) {
            const formattedNews = rawData.data.map(item => ({
                title: item.title,
                url: item.url,
                text: item.snippet || item.description || '',
                publishedDate: item.published_at,
                site: item.source,
                image: item.image_url,
            }));
            return formattedNews;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Marketaux News API Error:', error);
        throw error;
    }
};
