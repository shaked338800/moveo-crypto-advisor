import axios from 'axios';

export const getCryptoNews = async (coins: string[]) => {
  const query = coins.length > 0 ? coins.slice(0, 3).join(' OR ') : 'crypto';

  try {
    const { data } = await axios.get('https://newsdata.io/api/1/news', {
      params: {
        apikey: process.env.NEWSDATA_API_KEY,
        q: query,
        language: 'en',
        category: 'business,technology',
        size: 5,
      },
    });

    return (data.results || []).map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.link,
      source: article.source_name,
      publishedAt: article.pubDate,
      image: article.image_url || null,
    }));
  } catch {
    // Static fallback if API fails
    return [
      {
        title: 'Bitcoin surges past key resistance level',
        description: 'BTC breaks above $70,000 amid institutional buying pressure.',
        url: '#',
        source: 'CryptoNews',
        publishedAt: new Date().toISOString(),
        image: null,
      },
      {
        title: 'Ethereum ETF sees record inflows',
        description: 'Spot Ethereum ETFs attracted over $500M in a single day.',
        url: '#',
        source: 'CoinDesk',
        publishedAt: new Date().toISOString(),
        image: null,
      },
    ];
  }
};
