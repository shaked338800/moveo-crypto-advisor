import 'dotenv/config';

const REQUIRED_ENV_VARS = ['DATABASE_URL', 'JWT_SECRET', 'COINGECKO_API_KEY', 'NEWSDATA_API_KEY', 'OPENROUTER_API_KEY'];
const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import dashboardRoutes from './routes/dashboard.routes';
import votesRoutes from './routes/votes.routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/votes', votesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
