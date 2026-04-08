import { z } from 'zod';

export const preferencesSchema = z.object({
  coins: z.array(z.string()).min(1, 'Select at least one coin'),
  investorType: z.enum(['HODLer', 'Day Trader', 'NFT Collector', 'DeFi Explorer'], {
    error: 'Invalid investor type',
  }),
  contentTypes: z.array(z.string()).min(1, 'Select at least one content type'),
});
