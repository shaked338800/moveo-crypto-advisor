import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';
import { voteSchema } from '../schemas/votes.schema';

export const submitVote = async (req: AuthRequest, res: Response) => {
  try {
    const result = voteSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues[0].message });
      return;
    }

    const { sectionType, contentId, vote } = result.data;

    // Upsert — one vote per user per content item
    await prisma.vote.upsert({
      where: {
        userId_sectionType_contentId: {
          userId: req.userId!,
          sectionType,
          contentId,
        },
      },
      update: { vote },
      create: { userId: req.userId!, sectionType, contentId, vote },
    });

    res.json({ message: 'Vote saved' });
  } catch (err) {
    console.error('Vote error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
