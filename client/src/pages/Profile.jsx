import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  updateUserfailure,
  updateUserStart,
  updateUserSuccess
} from '../redux/user/userSlice'

// Backend helper
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${BACKEND_URL}${path}`, options)
  return res.json()
}

export default function Profile() {
  const dispatch = useDispatch()
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [showListingError, setShowListingError] = useState(false)
  const [userListing, setUserListing] = useState([])

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const data = await apiFetch(`/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (data.success === false) {
        dispatch(updateUserfailure(data.message))
        return
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (err) {
      dispatch(updateUserfailure(err.message))
    }
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart())
      const data = await apiFetch(`/user/delete/${currentUser._id}`, { method: 'DELETE' })

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }

      dispatch(deleteUserSuccess(data))
    } catch (err) {
      dispatch(deleteUserFailure(err.message))
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart())
      const data = await apiFetch('/auth/signout')

      if (data.success === false) {
        dispatch(signoutUserFailure(data.message))
        return
      }

      dispatch(signoutUserSuccess(data))
    } catch (err) {
      dispatch(signoutUserFailure(err.message))
    }
  }

  const handleShowListing = async () => {
    try {
      setShowListingError(false)
      const data = await apiFetch(`/user/listings/${currentUser._id}`)

      if (data.success === false) {
        setShowListingError(true)
        return
      }

      setUserListing(data)
    } catch (err) {
      setShowListingError(true)
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const data = await apiFetch(`/listing/delete/${listingId}`, { method: 'DELETE' })

      if (data.success === false) {
        console.log(data.message)
        return
      }

      setUserListing((prev) => prev.filter((listing) => listing._id !== listingId))
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      {/* Profile Image as link */}
      <Link to="/profile">
        <img
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          src={currentUser.avatar || '/default-avatar.png'}
          alt='profile'
        />
      </Link>

      <form className='flex flex-col gap-4 mt-4' onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Username'
          id='username'
          value={formData.username}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='email'
          placeholder='Email'
          id='email'
          value={formData.email}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='password'
          placeholder='Password'
          id='password'
          value={formData.password}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          type='submit'
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>

        <Link
          className='text-center bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign Out
        </span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User updated successfully!' : ''}</p>

      <button onClick={handleShowListing} className='text-green-700 w-full mt-4'>
        Show Listings
      </button>
      <p className='text-red-700 mt-2'>{showListingError ? 'Error showing listings' : ''}</p>

      {userListing?.length > 0 &&
        userListing.map((listing) => (
          <div key={listing._id} className='flex flex-col gap-4 mt-4'>
            <h1 className='text-center my-7 text-2xl'>Your Listing</h1>
            <div className='border rounded-lg p-3 flex justify-between items-center'>
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold hover:underline truncate gap-4'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className='flex flex-col items-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>

                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
