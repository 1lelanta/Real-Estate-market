import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

// Backend URL from environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Helper fetch function
const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${BACKEND_URL}${path}`, options)
  return res.json()
}

const SignUp = () => {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const data = await apiFetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='username'
          id='username'
          onChange={handleChange}
          className='border p-3 rounded-lg'
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          onChange={handleChange}
          className='border p-3 rounded-lg'
        />
        <input
          type='password'
          placeholder='password'
          id='password'
          onChange={handleChange}
          className='border p-3 rounded-lg'
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
        >
          {loading ? 'loading' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignUp
