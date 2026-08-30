import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { method, query, body } = req;

  try {
    // 1. GET - Fetch contact requests
    if (method === 'GET') {
      const response = await fetch(`${supabaseUrl}/rest/v1/contact_requests?order=created_at.desc`, {
        method: 'GET',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 404) {
        return res.status(404).json({ error: 'Table contact_requests does not exist yet.' });
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return res.status(response.status).json({ error: errData.message || 'Database error' });
      }

      const data = await response.json();
      return res.status(200).json(data);
    }

    // 2. PATCH - Update request status
    if (method === 'PATCH') {
      const id = query.id;
      const { status } = body || {};

      if (!id || !status) {
        return res.status(400).json({ error: 'Missing ID or status' });
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/contact_requests?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return res.status(response.status).json({ error: errData.message || 'Database error' });
      }

      return res.status(200).json({ success: true });
    }

    // 3. DELETE - Delete a request
    if (method === 'DELETE') {
      const id = query.id;

      if (!id) {
        return res.status(400).json({ error: 'Missing ID' });
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/contact_requests?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return res.status(response.status).json({ error: errData.message || 'Database error' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
