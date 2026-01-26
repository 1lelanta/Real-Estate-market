import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ListingItems from '../components/ListingItems'

// Backend URL from environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Helper for fetch requests
const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${BACKEND_URL}${path}`, options)
  return res.json()
}

export const Search = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  })
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState([])
  const [showmore, setShowmore] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    const typeFromUrl = urlParams.get('type')
    const parkingFromUrl = urlParams.get('parking')
    const furnishedFromUrl = urlParams.get('furnished')
    const offerFromUrl = urlParams.get('offer')
    const sortFromUrl = urlParams.get('sort')
    const orderFromUrl = urlParams.get('order')

    setSidebardata({
      searchTerm: searchTermFromUrl || '',
      type: typeFromUrl || 'all',
      parking: parkingFromUrl === 'true' ? true : false,
      furnished: furnishedFromUrl === 'true' ? true : false,
      offer: offerFromUrl === 'true' ? true : false,
      sort: sortFromUrl || 'created_at',
      order: orderFromUrl || 'desc',
    })

    const fetchListings = async () => {
      setLoading(true)
      const searchQuery = urlParams.toString()
      try {
        const data = await apiFetch(`/listing/get?${searchQuery}`)
        setListing(data)
        setShowmore(data.length > 8)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }

    fetchListings()
  }, [location.search])

  const handleChange = (e) => {
    const { id, value, checked } = e.target
    if (id === 'all' || id === 'rent' || id === 'sale') {
      setSidebardata({ ...sidebarata, type: id })
      return
    }
    if (id === 'searchTerm') {
      setSidebardata({ ...sidebarata, searchTerm: value })
      return
    }
    if (id === 'parking' || id === 'furnished' || id === 'offer') {
      setSidebardata({ ...sidebarata, [id]: checked })
      return
    }
    if (id === 'sort_order') {
      const [sort, order] = value.split('_')
      setSidebardata({ ...sidebarata, sort, order })
      return
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    Object.entries(sidebarata).forEach(([key, val]) => urlParams.set(key, val))
    navigate(`/search?${urlParams.toString()}`)
  }

  const onShowMorClick = async () => {
    const startIndex = listing.length
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)
    try {
      const data = await apiFetch(`/listing/get?${urlParams.toString()}`)
      setListing([...listing, ...data])
      if (data.length < 9) setShowmore(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-1 md:border-r-1 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          {/* Search Term */}
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='search...'
              className='border rounded-lg p-3 w-full'
              value={sidebarata.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            {['all', 'rent', 'sale'].map((t) => (
              <div key={t} className='flex gap-2'>
                <input
                  type='checkbox'
                  id={t}
                  className='w-5'
                  onChange={handleChange}
                  checked={sidebarata.type === t}
                />
                <span>{t === 'all' ? 'Rent & sale' : t}</span>
              </div>
            ))}
            <div className='flex gap-2'>
              <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={sidebarata.offer} />
              <span>Offer</span>
            </div>
          </div>

          {/* Amenities */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            {['parking', 'furnished'].map((amenity) => (
              <div key={amenity} className='flex gap-2'>
                <input
                  type='checkbox'
                  id={amenity}
                  className='w-5'
                  onChange={handleChange}
                  checked={sidebarata[amenity]}
                />
                <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
              </div>
            ))}
          </div>

          {/* Sort */}
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort: </label>
            <select
              id='sort_order'
              defaultValue='created_at_desc'
              onChange={handleChange}
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>

          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
        </form>
      </div>

      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results</h1>

        <div className='p-7 flex flex-wrap gap-2'>
          {!loading && listing.length === 0 && <p className='text-lg text-slate-700'>No Listing found</p>}
          {loading && <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>}
          {!loading && listing && listing.map((item) => <ListingItems key={item._id} listing={item} />)}
          {showmore && (
            <button
              onClick={onShowMorClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
