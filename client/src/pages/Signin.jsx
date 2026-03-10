import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'
import LoadingSpinner from '../components/LoadingSpinner'

// Backend URL from environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Helper fetch function
const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${BACKEND_URL}${path}`, options)
  return res.json()
}

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    })
  }

  useEffect(() => {
    const validate = () => {
      const errs = {}
      if (!formData.email) errs.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email'
      if (!formData.password) errs.password = 'Password is required'
      else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters'
      return errs
    }
    setErrors(validate())
  }, [formData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // client-side validation guard
    if (Object.keys(errors).length > 0) return
    try {
      dispatch(signInStart())
      const data = await apiFetch('/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // if your backend uses cookies
      })

      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return
      }

      dispatch(signInSuccess(data))
      navigate('/')
    } catch (err) {
      dispatch(signInFailure(err.message))
    }
  }

  return (
    <div className='p-6 max-w-md mx-auto mt-8'>
      <div className='bg-white shadow-md rounded-lg p-6'>
        <h1 className='text-2xl text-center font-semibold mb-4'>Welcome back</h1>
        {loading && <LoadingSpinner />}
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <label className='text-sm font-medium text-slate-700'>Email</label>
          <input
            type='email'
            placeholder='you@domain.com'
            id='email'
            value={formData.email}
            onChange={handleChange}
            className={`border p-3 rounded-lg ${errors.email ? 'border-red-400' : ''}`}
            aria-invalid={!!errors.email}
            aria-describedby='email-error'
          />
          {errors.email && <p id='email-error' className='text-red-500 text-sm'>{errors.email}</p>}

          <div>
            <div className='flex justify-between items-center'>
              <label className='text-sm font-medium text-slate-700'>Password</label>
              <Link to='/forgot-password' className='text-sm text-blue-600'>Forgot?</Link>
            </div>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                id='password'
                value={formData.password}
                onChange={handleChange}
                className={`border p-3 rounded-lg w-full ${errors.password ? 'border-red-400' : ''}`}
                aria-invalid={!!errors.password}
                aria-describedby='password-error'
              />
              <button type='button' onClick={() => setShowPassword((s) => !s)} className='absolute right-3 top-3 text-sm text-slate-600'>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p id='password-error' className='text-red-500 text-sm'>{errors.password}</p>}
          </div>

          <div className='flex items-center gap-2'>
            <input id='remember' type='checkbox' checked={formData.remember} onChange={handleChange} className='w-4 h-4' />
            <label htmlFor='remember' className='text-sm text-slate-700'>Remember me</label>
          </div>

          <button
            disabled={loading || Object.keys(errors).length > 0}
            className='bg-slate-700 disabled:opacity-60 text-white p-3 rounded-lg uppercase hover:opacity-95 flex items-center justify-center'
          >
            {loading && (
              <svg className='animate-spin h-5 w-5 mr-2' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
              </svg>
            )}
            Sign In
          </button>

          <div className='pt-2'>
            <OAuth />
          </div>
        </form>

        <div className='flex gap-2 mt-4 justify-center'>
          <p className='text-sm'>Don't have an account?</p>
          <Link to='/sign-up'>
            <span className='text-blue-700 text-sm'>Sign Up</span>
          </Link>
        </div>

        {error && <p className='text-red-500 mt-4 text-center'>{error}</p>}
      </div>
    </div>
  )
}

export default SignIn
