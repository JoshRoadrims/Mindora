const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const TOKEN_KEY = 'mindora_token'
const REFRESH_TOKEN_KEY = 'mindora_refresh_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token) {
  if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token)
  else localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function clearSession() {
  setToken(null)
  setRefreshToken(null)
}

async function tryRefresh() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return false
    const data = await res.json()
    setToken(data.accessToken)
    setRefreshToken(data.refreshToken)
    return true
  } catch {
    return false
  }
}

async function request(path, { method = 'GET', body, auth = true, _retried = false } = {}) {
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
    if (res.status === 401 && auth && !_retried && path !== '/api/auth/refresh') {
      const refreshed = await tryRefresh()
      if (refreshed) {
        return request(path, { method, body, auth, _retried: true })
      }
      clearSession()
    }

    let message = `Request failed (${res.status})`
    if (data?.error) {
      if (typeof data.error === 'string') {
        message = data.error
      } else {
        const fieldMessages = Object.values(data.error.fieldErrors || {}).flat()
        const combined = [...(data.error.formErrors || []), ...fieldMessages]
        if (combined.length) message = combined.join(', ')
      }
    }
    throw new Error(message)
  }

  return data
}

async function uploadFile(path, file, fields = {}) {
  const token = getToken()
  const formData = new FormData()
  formData.append('file', file)
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value))

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.error || `Upload failed (${res.status})`)
  }
  return data
}

async function fetchFileBlob(path) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error(`Could not load file (${res.status})`)
  return res.blob()
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
  verifyOtp: (payload) => request('/api/auth/verify-otp', { method: 'POST', body: payload, auth: false }),
  logout: (refreshToken) =>
    request('/api/auth/logout', { method: 'POST', body: { refreshToken }, auth: false }),
  logoutAll: () => request('/api/auth/logout-all', { method: 'POST' }),

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
  resolveSafetyAlert: (id) => request(`/api/admin/safety/${id}/resolve`, { method: 'PATCH' }),
  adminListProfessionals: () => request('/api/admin/professionals'),
  adminSetProfessionalVerified: (id, verified) =>
    request(`/api/admin/professionals/${id}/verify`, { method: 'PATCH', body: { verified } }),
  adminListUsers: () => request('/api/admin/users'),
  adminListAppointments: () => request('/api/admin/appointments'),
  adminListReferrals: () => request('/api/admin/referrals'),
  getAdminAnalytics: () => request('/api/admin/analytics'),
  adminListDeletionRequests: () => request('/api/admin/deletion-requests'),
  adminProcessDeletionRequest: (id, action) =>
    request(`/api/admin/deletion-requests/${id}/process`, { method: 'PATCH', body: { action } }),

  // --- Professionals (directory) ---
  listProfessionals: () => request('/api/professionals'),
  getProfessional: (id) => request(`/api/professionals/${id}`),

  // --- Professional agreement ---
  getAgreementStatus: () => request('/api/professionals/agreement/status'),
  acceptAgreement: () => request('/api/professionals/agreement/accept', { method: 'POST' }),

  // --- Appointments ---
  bookAppointment: (payload) => request('/api/appointments', { method: 'POST', body: payload }),
  getMyAppointments: () => request('/api/appointments/mine'),
  getProfessionalAppointments: () => request('/api/appointments'),
  updateAppointmentStatus: (id, status) =>
    request(`/api/appointments/${id}/status`, { method: 'PATCH', body: { status } }),

  // --- Clients (professional) ---
  listClients: () => request('/api/clients'),
  getClient: (userId) => request(`/api/clients/${userId}`),
  addClientNote: (userId, content) =>
    request(`/api/clients/${userId}/notes`, { method: 'POST', body: { content } }),

  // --- KYC documents ---
  uploadDocument: (type, file) => uploadFile('/api/documents', file, { type }),
  getMyDocuments: () => request('/api/documents/mine'),
  adminListDocuments: () => request('/api/documents'),
  adminReviewDocument: (id, status, reviewNotes) =>
    request(`/api/documents/${id}/review`, { method: 'PATCH', body: { status, reviewNotes } }),
  getDocumentFileBlob: (id) => fetchFileBlob(`/api/documents/${id}/file`),

  // --- Institutions ---
  adminListInstitutions: () => request('/api/institutions'),
  adminCreateInstitution: (payload) => request('/api/institutions', { method: 'POST', body: payload }),
  adminUpdateInstitution: (id, payload) =>
    request(`/api/institutions/${id}`, { method: 'PATCH', body: payload }),

  // --- Mindora AI ---
  sendAiMessage: (messages) => request('/api/ai/chat', { method: 'POST', body: { messages } }),

  // --- Account (consent / deletion / export) ---
  requestAccountDeletion: (reason) =>
    request('/api/account/deletion-request', { method: 'POST', body: { reason } }),
  getMyDeletionRequest: () => request('/api/account/deletion-request/mine'),
  exportMyData: () => request('/api/account/export'),
}