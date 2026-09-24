import React, { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { api, setToken, setRefreshToken, getRefreshToken, clearSession, getToken } from './api.js'
import { checkInQuestions } from './mockData.js'

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [role, setRoleState] = useState(null)
  const [authUser, setAuthUser] = useState(null)
  const [lastResult, setLastResult] = useState(null)
  const [selectedProfessional, setSelectedProfessional] = useState(null)
  const [booking, setBooking] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [otpPending, setOtpPending] = useState(null)

  const storeSession = (data) => {
    setToken(data.accessToken)
    setRefreshToken(data.refreshToken)
  }

  // Direct role-clear, no server call — used internally after logout
  // completes, and as a fallback if the server call fails.
  const clearLocalState = useCallback(() => {
    setRoleState(null)
    clearSession()
    setAuthUser(null)
    setLastResult(null)
    setBooking(null)
    setOtpPending(null)
  }, [])

  // The real logout: tells the server to revoke this refresh token (so it
  // can never be used again, even if someone captured it), then clears
  // local state. Falls back to clearing local state even if the server
  // call fails, so the user is never stuck unable to log out.
  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        await api.logout(refreshToken)
      } catch {
        // best-effort — still clear local state below regardless
      }
    }
    clearLocalState()
  }, [clearLocalState])

  const setRole = useCallback(
    (next) => {
      if (next === null) {
        logout()
      } else {
        setRoleState(next)
      }
    },
    [logout]
  )

  const requestLogin = useCallback(async (role, email, password) => {
    setAuthError(null)
    try {
      const loginFn = { user: api.loginUser, professional: api.loginProfessional, admin: api.loginAdmin }[role]
      const data = await loginFn({ email, password })
      if (data.otpRequired) {
        setOtpPending({ role, email })
        return true
      }
      setAuthError('Unexpected response from server.')
      return false
    } catch (err) {
      setAuthError(err.message)
      return false
    }
  }, [])

  const verifyOtp = useCallback(
    async (code) => {
      if (!otpPending) {
        setAuthError('No login in progress.')
        return false
      }
      setAuthError(null)
      try {
        const data = await api.verifyOtp({ role: otpPending.role, email: otpPending.email, code })
        storeSession(data)
        setAuthUser(data.user ?? data.professional ?? data.admin)
        setRoleState(otpPending.role)
        setOtpPending(null)
        return true
      } catch (err) {
        setAuthError(err.message)
        return false
      }
    },
    [otpPending]
  )

  const cancelOtp = useCallback(() => {
    setOtpPending(null)
    setAuthError(null)
  }, [])

  const registerUser = useCallback(async (fullName, email, password) => {
    setAuthError(null)
    try {
      const data = await api.registerUser({ fullName, email, password })
      storeSession(data)
      setAuthUser(data.user)
      setRoleState('user')
      return true
    } catch (err) {
      setAuthError(err.message)
      return false
    }
  }, [])

  const registerProfessional = useCallback(async (fullName, email, password) => {
    setAuthError(null)
    try {
      const data = await api.registerProfessional({ fullName, email, password })
      storeSession(data)
      setAuthUser(data.professional)
      setRoleState('professional')
      return true
    } catch (err) {
      setAuthError(err.message)
      return false
    }
  }, [])

  const submitCheckIn = useCallback(async (answersById) => {
    const answers = checkInQuestions.map((q) => ({
      domain: q.id,
      questionId: q.id,
      value: answersById[q.id],
    }))
    const result = await api.submitCheckIn(answers)
    setLastResult(result)
    return result
  }, [])

  const value = useMemo(
    () => ({
      role,
      setRole,
      authUser,
      authError,
      isAuthenticated: Boolean(getToken()),
      otpPending,
      requestLogin,
      verifyOtp,
      cancelOtp,
      registerUser,
      registerProfessional,
      submitCheckIn,
      lastResult,
      selectedProfessional,
      setSelectedProfessional,
      booking,
      setBooking,
    }),
    [
      role,
      authUser,
      authError,
      otpPending,
      requestLogin,
      verifyOtp,
      cancelOtp,
      registerUser,
      registerProfessional,
      submitCheckIn,
      lastResult,
      selectedProfessional,
      booking,
      setRole,
    ]
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}