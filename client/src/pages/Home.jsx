import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import ListingItems from '../components/ListingItems';

export default function Home() {
  const [offerListing, setOfferListing] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  console.log(saleListings)
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListing(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-3xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          lelanta Estate market is the best place to Find
          your next home to live.
          <br />
          We have a wide range of properties for YOU to
          choose from
        </div>
        <Link
          to={"/search"}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          let's get started
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className='h-[500px]'
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
    
      {/* listing results for offer, sale and rent */}
      <div className='max-w-6xl mx-auto p-3 flex-col
      gap-8 my-10'>

        {
          offerListing && offerListing.length>0 &&(
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold
                text-slate-700 '>Recent Offer</h2>
                <Link className='
                text-sm text-blue-800
                hover:underline' to={'/search?offer=true'}>
                  Show more offers
                </Link>

              </div>
                  <div className=' flex flex-wrap gap-4'>
                      {offerListing.map((listing) => (
                    <ListingItems listing={listing} key={listing._id} />
                  ))}
                        
                </div>
            </div>
          )
        }

        {
          rentListings && rentListings.length>0 &&(
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold
                text-slate-700 '>Recent places for rent</h2>
                <Link className='
                text-sm text-blue-800
                hover:underline' to={'/search?type=rent'}>
                  Show more places for rents
                </Link>

              </div>
                  <div className=' flex flex-wrap gap-4'>
                      {rentListings.map((listing) => (
                    <ListingItems listing={listing} key={listing._id} />
                  ))}
                        
                </div>
            </div>
          )
        }


        {
          saleListings && saleListings.length>0 &&(
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold
                text-slate-700 '>Recent places for sales</h2>
                <Link className='
                text-sm text-blue-800
                hover:underline' to={'/search?type=sale'}>
                  Show more places for sales
                </Link>

              </div>
                  <div className=' flex flex-wrap gap-4'>
                      {saleListings.map((listing) => (
                    <ListingItems listing={listing} key={listing._id} />
                  ))}
                        
                </div>
            </div>
          )
        }


        

      </div>
    </div>
  );
}
