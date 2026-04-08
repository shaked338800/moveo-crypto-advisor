import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';
import { voteSchema } from '../schemas/votes.schema';

export const getVotes = async (req: AuthRequest, res: Response) => {
  try {
    const votes = await prisma.vote.findMany({
      where: { userId: req.userId! },
      select: { sectionType: true, contentId: true, vote: true },
    });
    res.json(votes);
  } catch (err) {
    console.error('Get votes error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitVote = async (req: AuthRequest, res: Response) => {
  try {
    const result = voteSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues[0].message });
      return;
    }

    const { sectionType, contentId, vote } = result.data;

    // Upsert — one vote per user per content item
    const saved = await prisma.vote.upsert({
      where: {
        userId_sectionType_contentId: {
          userId: req.userId!,
          sectionType,
          contentId,
        },
      },
      update: { vote },
      create: { userId: req.userId!, sectionType, contentId, vote },
      select: { sectionType: true, contentId: true, vote: true },
    });

    res.json(saved);
  } catch (err) {
    console.error('Vote error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
