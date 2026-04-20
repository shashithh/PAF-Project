import React from 'react'
import { useNavigate } from 'react-router-dom'

// New booking shortcut — just redirect to the browse flow
export default function NewBookingPage() {
  const navigate = useNavigate()
  React.useEffect(() => { navigate('/book', { replace: true }) }, [navigate])
  return null
}
