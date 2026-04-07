import { z } from 'zod';

export const voteSchema = z.object({
  sectionType: z.string().min(1, 'Section type is required'),
  contentId: z.string().min(1, 'Content ID is required'),
  vote: z.literal(1).or(z.literal(-1)),
});
