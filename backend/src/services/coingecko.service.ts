import axios from 'axios';

// Map display names to CoinGecko IDs
const COIN_ID_MAP: Record<string, string> = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  solana: 'solana',
  bnb: 'binancecoin',
  xrp: 'ripple',
  dogecoin: 'dogecoin',
};

export const getCoinPrices = async (coins: string[]) => {
  const ids = coins
    .map((c) => COIN_ID_MAP[c.toLowerCase()])
    .filter(Boolean)
    .join(',');

  if (!ids) return [];

  const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
    params: {
      vs_currency: 'usd',
      ids,
      order: 'market_cap_desc',
      sparkline: false,
    },
    headers: {
      'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
    },
  });

  return data.map((coin: any) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price,
    change24h: coin.price_change_percentage_24h,
    image: coin.image,
    marketCap: coin.market_cap,
  }));
};
