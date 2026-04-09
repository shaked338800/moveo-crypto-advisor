import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';
import { getCoinPrices, getCoinChart } from '../services/coingecko.service';
import { getCryptoNews } from '../services/news.service';
import { getAiInsight } from '../services/ai.service';
import { getRandomMeme } from '../services/meme.service';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const preference = await prisma.preference.findUnique({
      where: { userId: req.userId! },
    });

    if (!preference) {
      res.status(400).json({ error: 'User has no preferences set' });
      return;
    }

    const { coins, investorType } = preference;

    // Fetch all 4 sections in parallel
    const [coinPrices, news, aiInsight, meme] = await Promise.all([
      getCoinPrices(coins),
      getCryptoNews(coins),
      getAiInsight(coins, investorType),
      getRandomMeme(),
    ]);

    res.json({ coinPrices, news, aiInsight, meme });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getChart = async (req: AuthRequest, res: Response) => {
  const coinId = req.params.coinId as string;
  const prices = await getCoinChart(coinId);
  res.json({ prices });
};
