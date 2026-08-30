import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/portfolio_users?username=eq.${encodeURIComponent(username)}&password=eq.${encodeURIComponent(password)}`,
      {
        method: 'GET',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 404) {
      return res.status(404).json({ error: 'Table portfolio_users does not exist yet.' });
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: errData.message || 'Database error' });
    }

    const users = await response.json();
    if (users && users.length > 0) {
      const user = users[0];
      return res.status(200).json({
        success: true,
        user: {
          username: user.username,
          role: user.role
        }
      });
    } else {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
