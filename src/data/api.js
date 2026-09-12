const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const TOKEN_KEY = 'mindora_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : null

  if (!res.ok) {
    const message = data?.error?.formErrors?.join(', ') || data?.error || `Request failed (${res.status})`
    throw new Error(typeof message === 'string' ? message : 'Request failed')
  }

  return data
}

export const api = {
  // --- Auth ---
  registerUser: (payload) => request('/api/auth/user/register', { method: 'POST', body: payload, auth: false }),
  loginUser: (payload) => request('/api/auth/user/login', { method: 'POST', body: payload, auth: false }),
  registerProfessional: (payload) =>
    request('/api/auth/professional/register', { method: 'POST', body: payload, auth: false }),
  loginProfessional: (payload) =>
    request('/api/auth/professional/login', { method: 'POST', body: payload, auth: false }),
  loginAdmin: (payload) => request('/api/auth/admin/login', { method: 'POST', body: payload, auth: false }),

  // --- Check-ins ---
  submitCheckIn: (answers) => request('/api/check-ins', { method: 'POST', body: { answers } }),
  getLatestCheckIn: () => request('/api/check-ins/latest'),
  getCheckInHistory: () => request('/api/check-ins'),

  // --- Referrals (professional) ---
  listReferrals: () => request('/api/referrals'),
  getReferral: (id) => request(`/api/referrals/${id}`),
  acceptReferral: (id) => request(`/api/referrals/${id}/accept`, { method: 'POST' }),

  // --- Admin ---
  getAdminOverview: () => request('/api/admin/overview'),
  getAdminSafety: () => request('/api/admin/safety'),

  // --- Professionals (directory) ---
  listProfessionals: () => request('/api/professionals'),
  getProfessional: (id) => request(`/api/professionals/${id}`),

  // --- Appointments ---
  bookAppointment: (payload) => request('/api/appointments', { method: 'POST', body: payload }),
  getMyAppointments: () => request('/api/appointments/mine'),
  getProfessionalAppointments: () => request('/api/appointments'),

  // --- Clients (professional) ---
  listClients: () => request('/api/clients'),
  getClient: (userId) => request('/api/clients/${userID}'),
  addClientNote: (userId, content) =>
    request('/api/clients/${userId}/notes', {method: 'POST', body { content }}),
}