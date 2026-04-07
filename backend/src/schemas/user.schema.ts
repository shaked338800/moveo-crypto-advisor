import { z } from 'zod';

export const preferencesSchema = z.object({
  coins: z.array(z.string()).min(1, 'Select at least one coin'),
  investorType: z.string().min(1, 'Investor type is required'),
  contentTypes: z.array(z.string()).min(1, 'Select at least one content type'),
});
