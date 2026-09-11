import React, { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { api, setToken, getToken } from './api.js'
import { checkInQuestions } from './mockData.js'

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [role, setRoleState] = useState(null) // 'user' | 'professional' | 'admin'
  const [authUser, setAuthUser] = useState(null) // { id, fullName, email } from the API
  const [lastResult, setLastResult] = useState(null) // server response from POST /check-ins
  const [selectedProfessional, setSelectedProfessional] = useState(null)
  const [booking, setBooking] = useState(null)
  const [authError, setAuthError] = useState(null)

  // Wrap setRole so logging out (role -> null) also clears the token and
  // any per-session state, rather than leaving a stale token around.
  const setRole = useCallback((next) => {
    setRoleState(next)
    if (next === null) {
      setToken(null)
      setAuthUser(null)
      setLastResult(null)
      setBooking(null)
    }
  }, [])

  const loginUser = useCallback(async (email, password) => {
    setAuthError(null)
    try {
      const data = await api.loginUser({ email, password })
      setToken(data.token)
      setAuthUser(data.user)
      setRoleState('user')
      return true
    } catch (err) {
      setAuthError(err.message)
      return false
    }
  }, [])

  const registerUser = useCallback(async (fullName, email, password) => {
    setAuthError(null)
    try {
      const data = await api.registerUser({ fullName, email, password })
      setToken(data.token)
      setAuthUser(data.user)
      setRoleState('user')
      return true
    } catch (err) {
      setAuthError(err.message)
      return false
    }
  }, [])

  const loginProfessional = useCallback(async (email, password) => {
    setAuthError(null)
    try {
      const data = await api.loginProfessional({ email, password })
      setToken(data.token)
      setAuthUser(data.professional)
      setRoleState('professional')
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
      setToken(data.token)
      setAuthUser(data.professional)
      setRoleState('professional')
      return true
    } catch (err) {
      setAuthError(err.message)
      return false
    }
  }, [])

  const loginAdmin = useCallback(async (email, password) => {
    setAuthError(null)
    try {
      const data = await api.loginAdmin({ email, password })
      setToken(data.token)
      setAuthUser(data.admin)
      setRoleState('admin')
      return true
    } catch (err) {
      setAuthError(err.message)
      return false
    }
  }, [])

  // Converts the { [questionId]: value } shape the check-in UI collects into
  // the { domain, questionId, value }[] shape the API expects, submits it,
  // and stores the server's computed risk level (the client never computes
  // risk itself — see checkin.routes.js for why).
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
      loginUser,
      registerUser,
      loginProfessional,
      registerProfessional,
      loginAdmin,
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
      loginUser,
      registerUser,
      loginProfessional,
      registerProfessional,
      loginAdmin,
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