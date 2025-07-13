import Parser from 'rss-parser';
import { RSS_FEEDS } from '../constants';

const parser = new Parser();

export const fetchRssFeed = async (url) => {
  const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
  try {
    const feed = await parser.parseURL(CORS_PROXY + url);
    return feed.items.map(item => ({
      title: item.title,
      url: item.link,
      text: item.contentSnippet || item.content || '',
      publishedDate: item.isoDate,
      site: feed.title,
    }));
  } catch (error) {
    console.error(`Failed to fetch RSS feed from ${url}:`, error);
    throw error;
  }
};

export const fetchAllRssFeeds = async () => {
  const allItems = [];
  for (const feed of RSS_FEEDS) {
    try {
      const items = await fetchRssFeed(feed.url);
      allItems.push(...items);
    } catch (error) {
      // Ignore individual feed errors
    }
  }
  return allItems.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
};
