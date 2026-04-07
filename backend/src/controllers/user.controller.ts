import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../prisma';

export const savePreferences = async (req: AuthRequest, res: Response) => {
  try {
    const { coins, investorType, contentTypes } = req.body;

    if (!coins || !investorType || !contentTypes) {
      res.status(400).json({ error: 'All preference fields are required' });
      return;
    }

    await prisma.preference.upsert({
      where: { userId: req.userId! },
      update: { coins, investorType, contentTypes },
      create: { userId: req.userId!, coins, investorType, contentTypes },
    });

    await prisma.user.update({
      where: { id: req.userId! },
      data: { onboardingCompleted: true },
    });

    res.json({ message: 'Preferences saved' });
  } catch (err) {
    console.error('Save preferences error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      include: { preference: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      onboardingCompleted: user.onboardingCompleted,
      preference: user.preference,
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
