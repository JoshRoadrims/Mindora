import { Navigate } from 'react-router-dom'
import { getToken } from '../data/api.js'

// Hard gate: no valid token in storage, no access to the page — full stop.
// This exists specifically so a failed/incomplete login or registration can
// never silently show an authenticated-looking shell with broken data.
export default function RequireAuth({ children }) {
  if (!getToken()) {
    return <Navigate to="/" replace />
  }
  return children
}