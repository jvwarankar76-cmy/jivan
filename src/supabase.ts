export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export interface PortfolioUser {
  username: string;
  role: 'admin' | 'guest';
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'read' | 'unread';
  created_at: string;
}

/**
 * Submit a contact request to Supabase
 */
export async function submitContactRequest(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_requests`, {
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        status: 'unread'
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData.message || `HTTP error! status: ${response.status}`
      };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error occurred' };
  }
}

/**
 * Sign in admin using Supabase Auth endpoint
 */
export async function signInAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error_description || data.error || 'Authentication failed'
      };
    }

    return {
      success: true,
      token: data.access_token
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error occurred' };
  }
}

/**
 * Fetch all contact requests via Vercel Serverless Function
 */
export async function fetchContactRequests(): Promise<{
  success: boolean;
  data?: ContactRequest[];
  error?: string;
  tableMissing?: boolean;
}> {
  try {
    const response = await fetch('/api/contact-requests', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 404) {
      return {
        success: false,
        tableMissing: true,
        error: 'Table contact_requests does not exist yet.'
      };
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData.error || `HTTP error! status: ${response.status}`
      };
    }

    const data: ContactRequest[] = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error occurred' };
  }
}

/**
 * Update request status (read / unread) via Vercel Serverless Function
 */
export async function updateRequestStatus(
  id: string,
  status: 'read' | 'unread'
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/contact-requests?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData.error || `HTTP error! status: ${response.status}`
      };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error occurred' };
  }
}

/**
 * Delete a request via Vercel Serverless Function
 */
export async function deleteRequest(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/contact-requests?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData.error || `HTTP error! status: ${response.status}`
      };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error occurred' };
  }
}

/**
 * Sign in admin or guest via Vercel Serverless Function
 */
export async function signInWithCredentials(
  username: string,
  passwordRaw: string
): Promise<{
  success: boolean;
  user?: PortfolioUser;
  error?: string;
  tableMissing?: boolean;
}> {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password: passwordRaw
      })
    });

    if (response.status === 404) {
      return {
        success: false,
        tableMissing: true,
        error: 'Table portfolio_users does not exist yet.'
      };
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`
      };
    }

    return {
      success: true,
      user: data.user
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error occurred' };
  }
}
