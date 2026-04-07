import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Gradient background blobs */}
      <div className="absolute top-[-10rem] left-[-10rem] w-[40rem] h-[40rem] bg-purple-700 opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-10rem] w-[40rem] h-[40rem] bg-blue-700 opacity-20 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-2xl px-6">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-white/10 text-sm text-white/60 border border-white/10">
          AI-Powered Crypto Dashboard
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
          Your personal crypto advisor, powered by AI
        </h1>

        <p className="text-white/50 text-lg mb-10">
          Get daily insights, live prices, and curated news tailored to your investment style.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 font-semibold px-8">
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black px-8"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
