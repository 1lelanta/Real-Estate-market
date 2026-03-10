import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api'

const OAuth = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)
      const result = await signInWithPopup(auth, provider)

      const payload = { name: result.user.displayName, email: result.user.email, photo: result.user.photoURL }

      const res = await fetch(`${BACKEND_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const text = await res.text()
      let data = {}
      if (text) {
        try { data = JSON.parse(text) } catch { data = text }
      }

      if (!res.ok) {
        console.error('Google auth failed', data)
        return
      }

      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      console.log('could not sign in with google', error)
    }
  }

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 cursor-pointer'
    >
      Continue with Google
    </button>
  )
}

export default OAuth
