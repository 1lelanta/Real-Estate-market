import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import LoadingSpinner from '../components/LoadingSpinner'

// Backend URL from environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Helper fetch function - safe JSON parsing and error handling
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

const SignUp = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  useEffect(() => {
    const errs = {}
    if (!formData.username) errs.username = 'Username is required'
    if (!formData.email) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email'
    if (!formData.password) errs.password = 'Password is required'
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (formData.confirm !== formData.password) errs.confirm = 'Passwords do not match'
    setErrors(errs)
  }, [formData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // client-side validation guard
    if (Object.keys(errors).length > 0) return
    try {
      setLoading(true)
      const payload = { username: formData.username, email: formData.email, password: formData.password }
      const data = await apiFetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include', // if backend uses cookies
      })

      setLoading(false)
      if (data.success === false) {
        setError(data.message)
        return
      }

      setError(null)
      navigate('/sign-in')
    } catch (err) {
      setLoading(false)
      setError('Something went wrong')
      console.error(err)
    }
  }

  return (
    <div className='p-6 max-w-md mx-auto mt-8'>
      <div className='bg-white shadow-md rounded-lg p-6'>
        <h1 className='text-2xl text-center font-semibold mb-4'>Create account</h1>
        {loading && <LoadingSpinner />}
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <label className='text-sm font-medium text-slate-700'>Username</label>
          <input id='username' value={formData.username} onChange={handleChange} placeholder='Your name' className={`border p-3 rounded-lg ${errors.username ? 'border-red-400' : ''}`} />
          {errors.username && <p className='text-red-500 text-sm'>{errors.username}</p>}

          <label className='text-sm font-medium text-slate-700'>Email</label>
          <input id='email' value={formData.email} onChange={handleChange} placeholder='you@domain.com' className={`border p-3 rounded-lg ${errors.email ? 'border-red-400' : ''}`} />
          {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}

          <label className='text-sm font-medium text-slate-700'>Password</label>
          <div className='relative'>
            <input id='password' value={formData.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} placeholder='Choose a password' className={`border p-3 rounded-lg w-full ${errors.password ? 'border-red-400' : ''}`} />
            <button type='button' onClick={() => setShowPassword(s => !s)} className='absolute right-3 top-3 text-sm text-slate-600'>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}

          <label className='text-sm font-medium text-slate-700'>Confirm Password</label>
          <input id='confirm' value={formData.confirm} onChange={handleChange} type='password' placeholder='Repeat password' className={`border p-3 rounded-lg ${errors.confirm ? 'border-red-400' : ''}`} />
          {errors.confirm && <p className='text-red-500 text-sm'>{errors.confirm}</p>}

          <button disabled={loading || Object.keys(errors).length > 0} className='bg-slate-700 disabled:opacity-60 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>

          <div className='pt-2'>
            <OAuth />
          </div>
        </form>

        <div className='flex gap-2 mt-4 justify-center'>
          <p className='text-sm'>Have an account?</p>
          <Link to='/sign-in'>
            <span className='text-blue-700 text-sm'>Sign In</span>
          </Link>
        </div>

        {error && <p className='text-red-500 mt-4 text-center'>{error}</p>}
      </div>
    </div>
  )
}

export default SignUp
