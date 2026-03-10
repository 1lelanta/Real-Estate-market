import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ListingItems from '../components/ListingItems'
import LoadingSpinner from '../components/LoadingSpinner'

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
    sort: 'createdAt',
    order: 'desc',
  })
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState([])
  const [total, setTotal] = useState(null)
  const [showmore, setShowmore] = useState(false)
  const LIMIT = 9
  const isFetchingRef = useRef(false)
  const [filtersOpen, setFiltersOpen] = useState(true)

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
      sort: sortFromUrl || 'createdAt',
      order: orderFromUrl || 'desc',
    })

    const fetchListings = async () => {
      if (isFetchingRef.current) return
      isFetchingRef.current = true
      setLoading(true)
      const searchQuery = urlParams.toString()
      try {
        const data = await apiFetch(`/listing/get?${searchQuery}`)
        // Support both old array response and new { listings, total }
        const items = data.listings ?? data
        const totalCount = data.total ?? null
        setListing(items)
        setTotal(totalCount)
        if (totalCount !== null) {
          setShowmore(totalCount > items.length)
        } else {
          setShowmore(items.length >= LIMIT)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
        isFetchingRef.current = false
      }
    }

    fetchListings()
  }, [location.search])

  // Debounce for live search
  const debounceRef = useRef(null)

  useEffect(() => {
    // When sidebarata changes, update the URL and fetch results (debounced)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const urlParams = new URLSearchParams()
      Object.entries(sidebarata).forEach(([key, val]) => urlParams.set(key, val))
      navigate(`/search?${urlParams.toString()}`, { replace: true })
    }, 450)

    return () => clearTimeout(debounceRef.current)
  }, [sidebarata])

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

  const clearFilters = () => {
    setSidebardata({
      searchTerm: '',
      type: 'all',
      parking: false,
      furnished: false,
      offer: false,
      sort: 'createdAt',
      order: 'desc',
    })
  }

  const removeFilter = (key) => {
    if (key === 'type') return setSidebardata({ ...sidebarata, type: 'all' })
    setSidebardata({ ...sidebarata, [key]: false })
  }

  // Keep a submit handler for accessibility, but live updates handle navigation
  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    Object.entries(sidebarata).forEach(([key, val]) => urlParams.set(key, val))
    navigate(`/search?${urlParams.toString()}`)
  }

  const onShowMorClick = async () => {
    if (isFetchingRef.current) return
    const startIndex = listing.length
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)
    try {
      isFetchingRef.current = true
      setLoading(true)
      const data = await apiFetch(`/listing/get?${urlParams.toString()}`)
      const items = data.listings ?? data
      const totalCount = data.total ?? null
      setListing([...listing, ...items])
      if (totalCount !== null) {
        setTotal(totalCount)
        if (listing.length + items.length >= totalCount) setShowmore(false)
        else setShowmore(true)
      } else {
        if (items.length < LIMIT) setShowmore(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }

  // Infinite scroll: fetch more when near bottom
  useEffect(() => {
    const onScroll = () => {
      if (isFetchingRef.current || !showmore) return
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        onShowMorClick()
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [showmore, listing])

  return (
    <div className='flex flex-col md:flex-row'>
      <aside className='p-4 md:p-7 border-b md:border-r md:min-h-screen md:w-80'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-semibold text-lg'>Filters</h3>
          <div className='flex items-center gap-2'>
            <button className='text-sm text-slate-600 hover:underline hidden md:block' onClick={clearFilters}>Clear</button>
            <button className='md:hidden text-sm text-slate-600' onClick={() => setFiltersOpen((s) => !s)}>{filtersOpen ? 'Close' : 'Open'}</button>
          </div>
        </div>

        <div className={`${filtersOpen ? 'block' : 'hidden'} md:block`}>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <label className='whitespace-nowrap font-semibold block mb-2'>Search</label>
              <input
                type='text'
                id='searchTerm'
                placeholder='Search by title or description...'
                className='border rounded-lg p-3 w-full'
                value={sidebarata.searchTerm}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className='font-semibold block mb-2'>Type</label>
              <div className='flex gap-3'>
                <label className='flex items-center gap-2'>
                  <input type='radio' name='type' id='all' onChange={handleChange} checked={sidebarata.type === 'all'} />
                  <span className='text-sm'>All</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input type='radio' name='type' id='rent' onChange={handleChange} checked={sidebarata.type === 'rent'} />
                  <span className='text-sm'>Rent</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input type='radio' name='type' id='sale' onChange={handleChange} checked={sidebarata.type === 'sale'} />
                  <span className='text-sm'>Sale</span>
                </label>
              </div>
            </div>

            <div>
              <label className='font-semibold block mb-2'>Amenities</label>
              <div className='flex gap-3 items-center'>
                <label className='flex items-center gap-2'>
                  <input type='checkbox' id='parking' className='w-4' onChange={handleChange} checked={sidebarata.parking} />
                  <span className='text-sm'>Parking</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input type='checkbox' id='furnished' className='w-4' onChange={handleChange} checked={sidebarata.furnished} />
                  <span className='text-sm'>Furnished</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input type='checkbox' id='offer' className='w-4' onChange={handleChange} checked={sidebarata.offer} />
                  <span className='text-sm'>Offer</span>
                </label>
              </div>
            </div>

            <div>
              <label className='font-semibold block mb-2'>Sort</label>
              <select id='sort_order' value={`${sidebarata.sort}_${sidebarata.order}`} onChange={handleChange} className='border rounded-lg p-3 w-full'>
                <option value='regularPrice_desc'>Price high to low</option>
                <option value='regularPrice_asc'>Price low to high</option>
                <option value='createdAt_desc'>Latest</option>
                <option value='createdAt_asc'>Oldest</option>
              </select>
            </div>

            <div className='flex gap-2 mt-2'>
              <button type='button' onClick={clearFilters} className='text-sm md:hidden text-slate-600'>Clear</button>
              <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Apply</button>
            </div>
          </form>
        </div>
      </aside>

      <div className='flex-1'>
        <div className='flex items-center justify-between border-b p-3 mt-5'>
          <h1 className='text-2xl font-semibold text-slate-700'>Listing results</h1>
          <div className='text-sm text-slate-600'>
            {total !== null ? `Showing ${listing.length} of ${total}` : `${listing.length} results`}
          </div>
        </div>

        <div className='p-7'>
          {/* Applied filter chips */}
          <div className='flex gap-2 flex-wrap mb-4'>
            {sidebarata.searchTerm && (
              <button className='bg-yellow-100 text-slate-700 px-3 py-1 rounded-full text-sm' onClick={() => setSidebardata({ ...sidebarata, searchTerm: '' })}>Search: {sidebarata.searchTerm}</button>
            )}
            {sidebarata.type && sidebarata.type !== 'all' && (
              <button className='bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm' onClick={() => removeFilter('type')}>Type: {sidebarata.type}</button>
            )}
            {['parking', 'furnished', 'offer'].map((f) =>
              sidebarata[f] ? (
                <button key={f} className='bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm' onClick={() => removeFilter(f)}>{f}</button>
              ) : null
            )}
            {(sidebarata.searchTerm || (sidebarata.type && sidebarata.type !== 'all') || sidebarata.parking || sidebarata.furnished || sidebarata.offer) && (
              <button onClick={clearFilters} className='text-sm text-red-600 underline'>Clear filters</button>
            )}
          </div>

          {/* Results grid */}
          <div className='flex flex-wrap gap-4'>
            {!loading && listing.length === 0 && <p className='text-lg text-slate-700'>No listings found — try broadening your search</p>}
            {loading && <LoadingSpinner />}
            {!loading && listing && listing.map((item) => <ListingItems key={item._id} listing={item} highlight={sidebarata.searchTerm} />)}
          </div>

          {showmore && (
            <div className='w-full text-center my-6'>
              <button
                onClick={onShowMorClick}
                className='text-green-700 hover:underline p-3'
              >
                Show more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
