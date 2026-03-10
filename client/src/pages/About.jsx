import React from 'react'

const About = () => {
  return (
    <div className='max-w-5xl mx-auto p-6'>
      <section className='text-center py-8'>
        <h2 className='text-3xl font-bold text-slate-800'>About Lelanta Estate</h2>
        <p className='text-slate-600 mt-3'>
          We connect people with thoughtfully curated properties — whether you
          are searching to rent, buy or sell. Our mission is to make property
          search simple, transparent and enjoyable.
        </p>
      </section>

      <section className='grid md:grid-cols-2 gap-6 items-center py-6'>
        <div>
          <h3 className='text-2xl font-semibold text-slate-800'>Our Mission</h3>
          <p className='text-slate-600 mt-2'>
            We aim to empower users with fast search, fair listings, and clear
            communication with landlords and agents. We believe the right home
            can change lives — and finding it should be easy.
          </p>
          <ul className='list-disc ml-5 mt-4 text-slate-700'>
            <li>Accurate, verified listings</li>
            <li>Fast and flexible search tools</li>
            <li>User-first design and privacy</li>
          </ul>
        </div>
        <div>
          <img
            src='https://via.placeholder.com/600x360?text=Our+Mission'
            alt='About Lelanta'
            className='rounded-lg shadow-md w-full object-cover'
          />
        </div>
      </section>

      <section className='py-6'>
        <h3 className='text-2xl font-semibold text-slate-800'>Meet the team</h3>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4'>
          {[
            { name: 'Amina', role: 'Founder' },
            { name: 'Jon', role: 'Product' },
            { name: 'Priya', role: 'Engineering' },
          ].map((member) => (
            <div key={member.name} className='p-4 border rounded-lg text-center'>
              <div className='h-24 w-24 bg-slate-200 rounded-full mx-auto mb-3 flex items-center justify-center'>
                <span className='text-slate-600 font-semibold'>{member.name.charAt(0)}</span>
              </div>
              <h4 className='font-semibold text-slate-800'>{member.name}</h4>
              <p className='text-sm text-slate-600'>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='py-6'>
        <h3 className='text-2xl font-semibold text-slate-800'>Contact</h3>
        <p className='text-slate-600 mt-2'>
          For press, partnerships or support reach us at
          <a className='text-slate-700 underline ml-1' href='mailto:support@lelanta.com'>support@lelanta.com</a>
        </p>
      </section>
    </div>
  )
}

export default About