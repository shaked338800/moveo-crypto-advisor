import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import type { Preference } from '@/context/AuthContext';
import { getDashboardApi, getVotesApi, submitVoteApi, savePreferencesApi, getCoinChartApi } from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  image: string;
  marketCap: number;
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  image: string | null;
}

interface Meme {
  id: string;
  url: string;
  title: string;
}

interface DashboardData {
  coinPrices: Coin[];
  news: NewsArticle[];
  aiInsight: string;
  meme: Meme;
}

function SparkLine({ points }: { points: [number, number][] }) {
  if (points.length < 2) return null;
  const prices = points.map(([, p]) => p);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const W = 480;
  const H = 100;
  const toX = (i: number) => (i / (points.length - 1)) * W;
  const toY = (p: number) => H - ((p - min) / range) * H * 0.85 - H * 0.075;
  const d = points.map(([, p], i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(p).toFixed(1)}`).join(' ');
  const area = `${d} L ${W} ${H} L 0 ${H} Z`;
  const rising = prices[prices.length - 1] >= prices[0];
  const color = rising ? '#4ade80' : '#f87171';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 100 }}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#cg)" />
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function CoinChartModal({ coin, onClose }: { coin: Coin; onClose: () => void }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['chart', coin.id],
    queryFn: () => getCoinChartApi(coin.id),
    staleTime: 5 * 60 * 1000,
  });

  const prices = data?.prices ?? [];
  const priceValues = prices.map(([, p]) => p);
  const minPrice = priceValues.length ? Math.min(...priceValues) : 0;
  const maxPrice = priceValues.length ? Math.max(...priceValues) : 0;
  const rising = priceValues.length >= 2 && priceValues[priceValues.length - 1] >= priceValues[0];

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0f0f1f] border border-white/10 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {coin.image && <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />}
            <div>
              <h2 className="text-base font-bold text-white">{coin.name}</h2>
              <p className="text-white/40 text-xs">{coin.symbol}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">&times;</button>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-semibold text-white">${coin.price.toLocaleString()}</p>
          <p className={`text-sm font-medium mt-0.5 ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(2)}% (24h)
          </p>
        </div>

        {/* Chart */}
        <div className="bg-white/5 rounded-xl p-3 mb-3">
          {isLoading && (
            <div className="h-[100px] flex items-center justify-center">
              <p className="text-white/30 text-sm animate-pulse">Loading chart...</p>
            </div>
          )}
          {isError && (
            <div className="h-[100px] flex items-center justify-center">
              <p className="text-white/30 text-sm">Chart unavailable</p>
            </div>
          )}
          {!isLoading && !isError && prices.length >= 2 && <SparkLine points={prices} />}
          {!isLoading && !isError && prices.length < 2 && (
            <div className="h-[100px] flex items-center justify-center">
              <p className="text-white/30 text-sm">Not enough data</p>
            </div>
          )}
        </div>

        {/* X-axis labels + range info */}
        {prices.length >= 2 && (
          <div className="flex justify-between text-white/30 text-xs px-1 mb-3">
            <span>{formatDate(prices[0][0])}</span>
            <span className={rising ? 'text-green-400/60' : 'text-red-400/60'}>7-day</span>
            <span>{formatDate(prices[prices.length - 1][0])}</span>
          </div>
        )}

        {/* Min / Max */}
        {priceValues.length >= 2 && (
          <div className="flex gap-4 text-xs text-white/40 px-1">
            <span>Low: <span className="text-white/60">${minPrice.toLocaleString()}</span></span>
            <span>High: <span className="text-white/60">${maxPrice.toLocaleString()}</span></span>
          </div>
        )}
      </div>
    </div>
  );
}

const COINS = ['Bitcoin', 'Ethereum', 'Solana', 'BNB', 'XRP', 'Dogecoin'];
const INVESTOR_TYPES = ['HODLer', 'Day Trader', 'NFT Collector', 'DeFi Explorer'];
const CONTENT_TYPES = ['Market News', 'Charts', 'Social', 'Fun'];

function EditPreferencesModal({ current, onClose }: { current: Preference; onClose: () => void }) {
  const { setUser, user } = useAuth();
  const queryClient = useQueryClient();

  const [coins, setCoins] = useState<string[]>(current.coins);
  const [investorType, setInvestorType] = useState(current.investorType);
  const [contentTypes, setContentTypes] = useState<string[]>(current.contentTypes);
  const [error, setError] = useState('');

  const toggle = (list: string[], setList: (v: string[]) => void, item: string) =>
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => savePreferencesApi(coins, investorType, contentTypes),
    onSuccess: () => {
      if (user) setUser({ ...user, preference: { coins, investorType, contentTypes } });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to save preferences.');
    },
  });

  const canSave = coins.length > 0 && !!investorType && contentTypes.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f0f1f] border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Edit Preferences</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">&times;</button>
        </div>

        {/* Coins */}
        <div>
          <p className="text-sm text-white/60 mb-2">Coins</p>
          <div className="grid grid-cols-3 gap-2">
            {COINS.map((coin) => (
              <button
                key={coin}
                onClick={() => toggle(coins, setCoins, coin)}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  coins.includes(coin)
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                {coin}
              </button>
            ))}
          </div>
        </div>

        {/* Investor Type */}
        <div>
          <p className="text-sm text-white/60 mb-2">Investor Type</p>
          <div className="grid grid-cols-2 gap-2">
            {INVESTOR_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setInvestorType(type)}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  investorType === type
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Content Types */}
        <div>
          <p className="text-sm text-white/60 mb-2">Content Types</p>
          <div className="grid grid-cols-2 gap-2">
            {CONTENT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggle(contentTypes, setContentTypes, type)}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  contentTypes.includes(type)
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <div className="flex gap-3 pt-1">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/30 bg-white/10 text-white hover:bg-white/20"
          >
            Cancel
          </Button>
          <Button
            onClick={() => mutate()}
            disabled={!canSave || isPending}
            className="flex-1 bg-white text-black hover:bg-white/90 font-semibold"
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FeedbackPipelineCard() {
  const steps = [
    {
      icon: '👍',
      title: 'You Vote',
      description: 'Rate each section after reading',
    },
    {
      icon: '🗄️',
      title: 'Saved to the Database',
      description: 'Your votes are saved to our database, linked to your profile and preferences',
    },
    {
      icon: '📊',
      title: 'Patterns Emerge',
      description: 'Aggregated votes reveal which insights, coins, and news topics users find most valuable',
    },
    {
      icon: '🤖',
      title: 'Better Recommendations',
      description: 'Future recommendations can use this signal to prioritize relevant content and reduce noise',
    },
  ];

  return (
    <Card className="bg-white/5 border-white/10 text-white lg:col-span-2">
      <CardHeader className="pb-3 px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          🧠 How Feedback Helps Personalize the AI
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 relative">
              <span className="text-2xl">{step.icon}</span>
              <p className="text-sm font-semibold text-white">{step.title}</p>
              <p className="text-xs text-white/50">{step.description}</p>
              {i < steps.length - 1 && (
                <span className="hidden sm:block absolute right-0 top-3 translate-x-1/2 text-white/20 text-lg">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-white/30 text-center mt-6 italic">
          Your onboarding preferences and daily votes create the feedback signal for future personalization.
        </p>
      </CardContent>
    </Card>
  );
}

function VoteButtons({ sectionType, contentId, initialVote = null }: { sectionType: string; contentId: string; initialVote?: number | null }) {
  const [voted, setVoted] = useState<number | null>(initialVote);

  const { mutate } = useMutation({
    mutationFn: (vote: number) => submitVoteApi(sectionType, contentId, vote),
    onSuccess: (_data, vote) => setVoted(vote),
  });

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={() => mutate(1)}
        className={`text-sm px-3 py-1 rounded-full border transition-all ${
          voted === 1
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-white/20 text-white/50 hover:border-green-500 hover:text-green-400'
        }`}
      >
        👍
      </button>
      <button
        onClick={() => mutate(-1)}
        className={`text-sm px-3 py-1 rounded-full border transition-all ${
          voted === -1
            ? 'bg-red-500 border-red-500 text-white'
            : 'border-white/20 text-white/50 hover:border-red-500 hover:text-red-400'
        }`}
      >
        👎
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showEditPrefs, setShowEditPrefs] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: getDashboardApi,
  });

  const { data: votes = [] } = useQuery<{ sectionType: string; contentId: string; vote: number }[]>({
    queryKey: ['votes'],
    queryFn: getVotesApi,
  });

  const getVote = (sectionType: string, contentId: string) =>
    votes.find((v) => v.sectionType === sectionType && v.contentId === contentId)?.vote ?? null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {selectedCoin && (
        <CoinChartModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />
      )}
      {showEditPrefs && user?.preference && (
        <EditPreferencesModal current={user.preference} onClose={() => setShowEditPrefs(false)} />
      )}

      {/* Header */}
      <header className="border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">CryptoAdvisor</h1>
          <p className="text-white/50 text-xs sm:text-sm">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowEditPrefs(true)}
            variant="outline"
            size="sm"
            className="border-white/30 text-white/70 bg-transparent hover:bg-white/10 text-xs sm:text-sm"
          >
            Edit Preferences
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black text-xs sm:text-sm"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-white/50 animate-pulse text-sm sm:text-base">Loading your dashboard...</p>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-400 text-sm sm:text-base text-center px-4">
              Failed to load dashboard. Make sure the backend is running.
            </p>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

            {/* Coin Prices */}
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  📈 Coin Prices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 px-4 sm:px-6">
                {data.coinPrices.length === 0 && (
                  <p className="text-white/40 text-sm">No coin data available.</p>
                )}
                {data.coinPrices.map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => setSelectedCoin(coin)}
                    className="w-full flex items-center justify-between py-2 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">{coin.name}</p>
                        <p className="text-white/40 text-xs group-hover:text-white/60 transition-colors">View chart →</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-semibold text-xs sm:text-sm">${coin.price.toLocaleString()}</p>
                      <p className={`text-xs font-medium ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                ))}
                <VoteButtons sectionType="coins" contentId="coin-prices" initialVote={getVote('coins', 'coin-prices')} />
              </CardContent>
            </Card>

            {/* AI Insight */}
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  🤖 AI Insight of the Day
                </CardTitle>
                <p className="text-white/30 text-xs mt-1">Generated based on current market trends</p>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <p className="text-white/80 text-sm leading-relaxed">{data.aiInsight}</p>
                <VoteButtons sectionType="ai" contentId="ai-insight" initialVote={getVote('ai', 'ai-insight')} />
              </CardContent>
            </Card>

            {/* Market News */}
            <Card className="bg-white/5 border-white/10 text-white lg:col-span-2">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  📰 Market News
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {data.news.map((article) => (
                    <a
                      key={article.url || article.title}
                      href={article.url !== '#' ? article.url : undefined}
                      target={article.url !== '#' ? '_blank' : undefined}
                      rel="noreferrer"
                      className={`block p-3 rounded-lg bg-white/5 border border-white/5 transition-all ${article.url !== '#' ? 'hover:bg-white/10 cursor-pointer' : 'cursor-default'}`}
                    >
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-28 sm:h-32 object-cover rounded-md mb-3"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      )}
                      <p className="font-medium text-sm leading-snug mb-1">{article.title}</p>
                      {article.description && (
                        <p className="text-white/50 text-xs line-clamp-2">{article.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs border-white/20 text-white/40">
                          {article.source}
                        </Badge>
                      </div>
                    </a>
                  ))}
                </div>
                <VoteButtons sectionType="news" contentId="market-news" initialVote={getVote('news', 'market-news')} />
              </CardContent>
            </Card>

            {/* Fun Meme */}
            <Card className="bg-white/5 border-white/10 text-white lg:col-span-2">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  😂 Crypto Meme of the Day
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center px-4 sm:px-6">
                <p className="text-white/60 text-sm mb-3 italic text-center">"{data.meme.title}"</p>
                <img
                  src={data.meme.url}
                  alt={data.meme.title}
                  className="w-full max-w-sm sm:max-w-md max-h-72 sm:max-h-80 rounded-xl object-contain"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <VoteButtons sectionType="meme" contentId={data.meme.id} initialVote={getVote('meme', data.meme.id)} />
              </CardContent>
            </Card>

            {/* Feedback Pipeline */}
            <FeedbackPipelineCard />

          </div>
        )}
      </main>
    </div>
  );
}
