import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

// Backend URL from environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Helper fetch function
const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${BACKEND_URL}${path}`, options)
  return res.json()
}

const SignIn = () => {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
          {loading ? 'loading' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn
