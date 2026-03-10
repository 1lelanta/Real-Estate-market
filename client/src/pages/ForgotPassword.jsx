import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api'

const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${BACKEND_URL}${path}`, options)
  const text = await res.text()
  if (!text) {
    if (!res.ok) throw new Error(res.statusText || 'Network error')
    return {}
  }
  try {
    const data = JSON.parse(text)
    if (!res.ok) {
      const errMsg = data?.message || data?.error || res.statusText
      throw new Error(errMsg || 'Request failed')
    }
    return data
  } catch (err) {
    if (res.ok) return text
    throw err
  }
}

export default function ForgotPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const token = params.get('token')
  const id = params.get('id')

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  useEffect(() => {
    setMessage(null)
    setError(null)
  }, [token])

  const handleRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setLoading(false)
      if (data.resetLink) {
        setMessage('Reset link generated (dev): ' + data.resetLink)
      } else if (data.message) {
        setMessage(data.message)
      }
    } catch (err) {
      setLoading(false)
      setError('Something went wrong')
      console.error(err)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (!password || password !== confirm) return setError('Passwords must match')
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, token, password }),
      })
      setLoading(false)
      if (data.message) {
        setMessage(data.message)
        // navigate to sign-in after brief delay
        setTimeout(() => navigate('/sign-in'), 1200)
      }
    } catch (err) {
      setLoading(false)
      setError('Something went wrong')
      console.error(err)
    }
  }

  return (
    <div className='p-6 max-w-md mx-auto mt-8'>
      <div className='bg-white shadow-md rounded-lg p-6'>
        {!token ? (
          <>
            <h2 className='text-xl font-semibold mb-3'>Reset your password</h2>
            <p className='text-slate-600 mb-4'>Enter your account email and we'll create a reset link.</p>
            <form onSubmit={handleRequest} className='flex flex-col gap-3'>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='you@domain.com' className='border p-3 rounded-lg' />
              <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg'>Request reset</button>
            </form>
          </>
        ) : (
          <>
            <h2 className='text-xl font-semibold mb-3'>Choose a new password</h2>
            <form onSubmit={handleReset} className='flex flex-col gap-3'>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='New password' className='border p-3 rounded-lg' />
              <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type='password' placeholder='Confirm password' className='border p-3 rounded-lg' />
              <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg'>Set new password</button>
            </form>
          </>
        )}

        {loading && <p className='mt-3 text-slate-600'>Working...</p>}
        {message && <p className='mt-3 text-green-600 break-words'>{message}</p>}
        {error && <p className='mt-3 text-red-500'>{error}</p>}
      </div>
    </div>
  )
}
