import React, { createContext, useContext, useMemo, useState } from 'react'

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [role, setRole] = useState(null) // 'user' | 'professional' | 'admin'
  const [checkInAnswers, setCheckInAnswers] = useState({})
  const [lastResult, setLastResult] = useState(null) // { level: 'low' | 'elevated', ... }
  const [selectedProfessional, setSelectedProfessional] = useState(null)
  const [booking, setBooking] = useState(null)

  const submitCheckIn = (answers) => {
    setCheckInAnswers(answers)
    const values = Object.values(answers)
    const total = values.reduce((sum, v) => sum + v, 0)
    const max = values.length * 3
    const ratio = max ? total / max : 0
    const level = ratio >= 0.45 ? 'elevated' : 'low'
    const result = { level, ratio, total }
    setLastResult(result)
    return result
  }

  const value = useMemo(
    () => ({
      role,
      setRole,
      checkInAnswers,
      submitCheckIn,
      lastResult,
      selectedProfessional,
      setSelectedProfessional,
      booking,
      setBooking,
    }),
    [role, checkInAnswers, lastResult, selectedProfessional, booking]
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
