import Parser from 'rss-parser';
import { RSS_FEEDS } from '../constants';

const parser = new Parser();

export const fetchRssFeed = async (url) => {
  const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
  try {
    const feed = await parser.parseURL(CORS_PROXY + encodeURIComponent(url));
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

const parseSebiFeed = async (url) => {
    const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
    try {
        const response = await fetch(CORS_PROXY + encodeURIComponent(url));
        const text = await response.text();
        const items = [];
        const itemRegex = /<item>[\s\S]*?<\/item>/g;
        let match;
        while ((match = itemRegex.exec(text)) !== null) {
            const itemText = match[0];
            const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>/.exec(itemText);
            const linkMatch = /<link><!\[CDATA\[(.*?)\]\]><\/link>/.exec(itemText);
            const pubDateMatch = /<pubDate><!\[CDATA\[(.*?)\]\]><\/pubDate>/.exec(itemText);
            if (titleMatch && linkMatch && pubDateMatch) {
                items.push({
                    title: titleMatch[1],
                    url: linkMatch[1],
                    publishedDate: pubDateMatch[1],
                    site: 'SEBI',
                });
            }
        }
        return items;
    } catch (error) {
        console.error(`Failed to fetch or parse SEBI RSS feed from ${url}:`, error);
        throw error;
    }
};

export const fetchAllRssFeeds = async () => {
  const allItems = [];
  for (const feed of RSS_FEEDS) {
    try {
      let items;
      if (feed.name === 'SEBI') {
        items = await parseSebiFeed(feed.url);
      } else {
        items = await fetchRssFeed(feed.url);
      }
      allItems.push(...items);
    } catch (error) {
      // Ignore individual feed errors
    }
  }
  return allItems.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
};
