import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure the endpoint correctly handles POST requests
  if (req.method === 'POST') {
    const data = req.body;
    
    // TODO: Save the player to your database here
    
    res.status(201).json({ message: 'Player created successfully', player: data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
