import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { cardCount } = req.query;
      const key = `leaderboard_${cardCount}`;
      const data = await kv.get(key) || [];
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  } else if (req.method === 'POST') {
    try {
      const { cardCount, leaderboard } = req.body;
      const key = `leaderboard_${cardCount}`;
      await kv.set(key, leaderboard);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      res.status(500).json({ error: 'Failed to update leaderboard' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}