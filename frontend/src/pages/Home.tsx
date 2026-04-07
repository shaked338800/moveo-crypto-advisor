import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden px-4">
      <div className="absolute top-[-10rem] left-[-10rem] w-[30rem] h-[30rem] sm:w-[40rem] sm:h-[40rem] bg-purple-700 opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-10rem] w-[30rem] h-[30rem] sm:w-[40rem] sm:h-[40rem] bg-blue-700 opacity-20 rounded-full blur-3xl" />

      <div className="relative z-10 text-center w-full max-w-2xl">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-white/10 text-xs sm:text-sm text-white/60 border border-white/10">
          AI-Powered Crypto Dashboard
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
          Your personal crypto advisor, powered by AI
        </h1>

        <p className="text-white/50 text-base sm:text-lg mb-8 sm:mb-10">
          Get daily insights, live prices, and curated news tailored to your investment style.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-white/90 font-semibold px-8">
              Get Started
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white bg-transparent hover:bg-white hover:text-black px-8"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
