import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import ListingItems from '../components/ListingItems';
import Footer from '../components/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const apiFetch = async (path) => {
  const res = await fetch(`${BACKEND_URL}${path}`);
  return res.json();
};

export default function Home() {
  const [offerListing, setOfferListing] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const data = await apiFetch('/listing/get?offer=true&limit=4');
        setOfferListing(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const data = await apiFetch('/listing/get?type=rent&limit=4');
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const data = await apiFetch('/listing/get?type=sale&limit=4');
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <>
      <div>
        {/* Top Section */}
        <div className='flex flex-col gap-6 p-28 px-3 max-w-3xl mx-auto'>
          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
            Find your next <span className='text-slate-500'>perfect</span>
            <br />
            place with ease
          </h1>
          <div className='text-gray-400 text-xs sm:text-sm'>
            Lelanta Estate market is the best place to find your next home to live.
            <br />
            We have a wide range of properties for YOU to choose from.
          </div>
          <Link
            to="/search"
            className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
          >
            let's get started
          </Link>
        </div>

        {/* Swiper */}
        <Swiper navigation>
          {offerListing?.length > 0 &&
            offerListing.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className='h-[500px]'
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>

        {/* Listings */}
        <div className='max-w-6xl mx-auto p-3 flex-col gap-8 my-10'>
          {/* Offer */}
          {offerListing?.length > 0 && (
            <div>
              <div className='my-3 flex justify-between items-center'>
                <h2 className='text-2xl font-semibold text-slate-700'>
                  Recent Offers
                </h2>
                <Link
                  className='text-sm text-blue-800 hover:underline'
                  to='/search?offer=true'
                >
                  Show more offers
                </Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {offerListing.map((listing) => (
                  <ListingItems listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}

          {/* Rent */}
          {rentListings?.length > 0 && (
            <div>
              <div className='my-3 flex justify-between items-center'>
                <h2 className='text-2xl font-semibold text-slate-700'>
                  Recent Places for Rent
                </h2>
                <Link
                  className='text-sm text-blue-800 hover:underline'
                  to='/search?type=rent'
                >
                  Show more places for rent
                </Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {rentListings.map((listing) => (
                  <ListingItems listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}

          {/* Sale */}
          {saleListings?.length > 0 && (
            <div>
              <div className='my-3 flex justify-between items-center'>
                <h2 className='text-2xl font-semibold text-slate-700'>
                  Recent Places for Sale
                </h2>
                <Link
                  className='text-sm text-blue-800 hover:underline'
                  to='/search?type=sale'
                >
                  Show more places for sale
                </Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {saleListings.map((listing) => (
                  <ListingItems listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
