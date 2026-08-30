export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

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
 * Fetch all contact requests (bypasses RLS using the Service Key)
 */
export async function fetchContactRequests(): Promise<{
  success: boolean;
  data?: ContactRequest[];
  error?: string;
  tableMissing?: boolean;
}> {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_requests?order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
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
        error: errData.message || `HTTP error! status: ${response.status}`
      };
    }

    const data: ContactRequest[] = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error occurred' };
  }
}

/**
 * Update request status (read / unread)
 */
export async function updateRequestStatus(
  id: string,
  status: 'read' | 'unread'
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_requests?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
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
 * Delete a request from Supabase
 */
export async function deleteRequest(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_requests?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
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
 * Sign in admin or guest using custom credentials table
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
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/portfolio_users?username=eq.${encodeURIComponent(username)}&password=eq.${encodeURIComponent(passwordRaw)}`,
      {
        method: 'GET',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 404) {
      return {
        success: false,
        tableMissing: true,
        error: 'Table portfolio_users does not exist yet.'
      };
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData.message || `HTTP error! status: ${response.status}`
      };
    }

    const users = await response.json();
    if (users && users.length > 0) {
      const user = users[0];
      return {
        success: true,
        user: {
          username: user.username,
          role: user.role
        }
      };
    } else {
      return {
        success: false,
        error: 'Invalid username or password'
      };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error occurred' };
  }
}
