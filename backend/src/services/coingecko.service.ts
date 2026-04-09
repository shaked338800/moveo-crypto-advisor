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

  try {
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
  } catch {
    return getFallbackCoins(coins);
  }
};

// Returns [[timestamp_ms, price], ...] for the last 7 days (daily interval)
export const getCoinChart = async (coinId: string): Promise<[number, number][]> => {
  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      {
        params: { vs_currency: 'usd', days: 7, interval: 'daily' },
        headers: { 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY },
      }
    );
    return data.prices as [number, number][];
  } catch {
    return [];
  }
};

const getFallbackCoins = (coins: string[]) => {
  const fallback: Record<string, object> = {
    bitcoin:  { id: 'bitcoin',      name: 'Bitcoin',  symbol: 'BTC', price: 60000, change24h: 0, image: '', marketCap: 1_200_000_000_000 },
    ethereum: { id: 'ethereum',     name: 'Ethereum', symbol: 'ETH', price: 3000,  change24h: 0, image: '', marketCap: 360_000_000_000  },
    solana:   { id: 'solana',       name: 'Solana',   symbol: 'SOL', price: 140,   change24h: 0, image: '', marketCap: 60_000_000_000   },
    binancecoin: { id: 'binancecoin', name: 'BNB',    symbol: 'BNB', price: 380,   change24h: 0, image: '', marketCap: 58_000_000_000   },
    ripple:   { id: 'ripple',       name: 'XRP',      symbol: 'XRP', price: 0.5,   change24h: 0, image: '', marketCap: 27_000_000_000   },
    dogecoin: { id: 'dogecoin',     name: 'Dogecoin', symbol: 'DOGE',price: 0.1,   change24h: 0, image: '', marketCap: 14_000_000_000   },
  };

  return coins
    .map((c) => COIN_ID_MAP[c.toLowerCase()])
    .filter(Boolean)
    .map((id) => fallback[id])
    .filter(Boolean);
};
