import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';

export const submitVote = async (req: AuthRequest, res: Response) => {
  try {
    const { sectionType, contentId, vote } = req.body;

    if (!sectionType || !contentId || vote === undefined) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    if (vote !== 1 && vote !== -1) {
      res.status(400).json({ error: 'Vote must be 1 or -1' });
      return;
    }

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
