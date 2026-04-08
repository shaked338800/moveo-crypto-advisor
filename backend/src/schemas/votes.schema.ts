import { z } from 'zod';

export const voteSchema = z.object({
  sectionType: z.string().min(1, 'Section type is required'),
  contentId: z.string().min(1, 'Content ID is required'),
  vote: z.union([z.literal(1), z.literal(-1)], { error: 'Vote must be 1 or -1' }),
});
