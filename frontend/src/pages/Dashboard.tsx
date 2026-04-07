import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getDashboardApi, submitVoteApi } from '@/api/auth.api';
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

function VoteButtons({ sectionType, contentId }: { sectionType: string; contentId: string }) {
  const [voted, setVoted] = useState<number | null>(null);

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

  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: getDashboardApi,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">CryptoAdvisor</h1>
          <p className="text-white/50 text-xs sm:text-sm">Welcome back, {user?.name}</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black text-xs sm:text-sm"
        >
          Logout
        </Button>
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
                  <div key={coin.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">{coin.name}</p>
                        <p className="text-white/40 text-xs">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-semibold text-xs sm:text-sm">${coin.price.toLocaleString()}</p>
                      <p className={`text-xs font-medium ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
                <VoteButtons sectionType="coins" contentId="coin-prices" />
              </CardContent>
            </Card>

            {/* AI Insight */}
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  🤖 AI Insight of the Day
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <p className="text-white/80 text-sm leading-relaxed">{data.aiInsight}</p>
                <VoteButtons sectionType="ai" contentId="ai-insight" />
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
                  {data.news.map((article, i) => (
                    <a
                      key={i}
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5"
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
                <VoteButtons sectionType="news" contentId="market-news" />
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
                <VoteButtons sectionType="meme" contentId={data.meme.id} />
              </CardContent>
            </Card>

          </div>
        )}
      </main>
    </div>
  );
}
