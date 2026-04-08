import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { savePreferencesApi } from '@/api/auth.api';

const COINS = ['Bitcoin', 'Ethereum', 'Solana', 'BNB', 'XRP', 'Dogecoin'];
const INVESTOR_TYPES = ['HODLer', 'Day Trader', 'NFT Collector', 'DeFi Explorer'];
const CONTENT_TYPES = ['Market News', 'Charts', 'Social', 'Fun'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { setUser, user } = useAuth();
  const [step, setStep] = useState(1);
  const [coins, setCoins] = useState<string[]>([]);
  const [investorType, setInvestorType] = useState('');
  const [contentTypes, setContentTypes] = useState<string[]>([]);

  const [error, setError] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () => savePreferencesApi(coins, investorType, contentTypes),
    onSuccess: () => {
      if (user) setUser({ ...user, onboardingCompleted: true });
      navigate('/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    },
  });

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <div className="absolute top-[-10rem] left-[-10rem] w-[30rem] h-[30rem] sm:w-[40rem] sm:h-[40rem] bg-purple-700 opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-10rem] w-[30rem] h-[30rem] sm:w-[40rem] sm:h-[40rem] bg-blue-700 opacity-20 rounded-full blur-3xl" />

      <Card className="w-full max-w-lg bg-white/5 border-white/10 text-white relative z-10">
        <CardHeader>
          <div className="flex justify-between text-white/40 text-sm mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mb-4 bg-white/10" />

          {step === 1 && (
            <>
              <CardTitle className="text-lg sm:text-xl">Which crypto assets interest you?</CardTitle>
              <CardDescription className="text-white/50">Select all that apply</CardDescription>
            </>
          )}
          {step === 2 && (
            <>
              <CardTitle className="text-lg sm:text-xl">What type of investor are you?</CardTitle>
              <CardDescription className="text-white/50">Pick one that fits you best</CardDescription>
            </>
          )}
          {step === 3 && (
            <>
              <CardTitle className="text-lg sm:text-xl">What content do you want to see?</CardTitle>
              <CardDescription className="text-white/50">Select all that apply</CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {COINS.map((coin) => (
                <button
                  key={coin}
                  onClick={() => toggleItem(coins, setCoins, coin)}
                  className={`py-3 px-3 sm:px-4 rounded-lg border text-sm font-medium transition-all ${
                    coins.includes(coin)
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {coin}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {INVESTOR_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setInvestorType(type)}
                  className={`py-3 px-3 sm:px-4 rounded-lg border text-sm font-medium transition-all ${
                    investorType === type
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleItem(contentTypes, setContentTypes, type)}
                  className={`py-3 px-3 sm:px-4 rounded-lg border text-sm font-medium transition-all ${
                    contentTypes.includes(type)
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-between pt-2">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && coins.length === 0) || (step === 2 && !investorType)}
                className="bg-white text-black hover:bg-white/90 font-semibold"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={() => mutate()}
                disabled={contentTypes.length === 0 || isPending}
                className="bg-white text-black hover:bg-white/90 font-semibold"
              >
                {isPending ? 'Saving...' : 'Finish'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
