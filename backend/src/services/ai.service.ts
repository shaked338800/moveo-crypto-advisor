import axios from 'axios';

export const getAiInsight = async (coins: string[], investorType: string) => {
  const prompt = `You are a crypto advisor. Give a short, sharp insight (3-4 sentences max) for a ${investorType} investor who is interested in ${coins.join(', ')}. Focus on today's market sentiment and one actionable tip. Be direct and confident.`;

  try {
    const { data } = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return data.choices?.[0]?.message?.content || getFallbackInsight(investorType);
  } catch {
    return getFallbackInsight(investorType);
  }
};

const getFallbackInsight = (investorType: string) => {
  const insights: Record<string, string> = {
    HODLer: 'Market volatility is normal — HODLers who stayed the course historically outperform short-term traders. Focus on your long-term thesis and avoid checking prices daily.',
    'Day Trader': 'Watch key support and resistance levels closely today. Volume confirmation is essential before entering any position in this market environment.',
    'NFT Collector': 'Blue-chip NFT collections are showing resilience even in bear markets. Focus on projects with strong communities and utility over pure speculation.',
    'DeFi Explorer': 'DeFi TVL is recovering — look for protocols offering sustainable yields rather than inflated APRs that tend to collapse quickly.',
  };
  return insights[investorType] || 'Stay informed, diversify your portfolio, and never invest more than you can afford to lose.';
};
