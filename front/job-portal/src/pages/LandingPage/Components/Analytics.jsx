import { BriefcaseBusiness, CheckCheckIcon, User } from 'lucide-react';
import React from 'react'
import { motion } from 'framer-motion';

export default function Analytics() {

  const stats = [
  {
    icon: User,
    value: '2.4M+',
    title: 'Active Users',
    growth: '+25%',
    bg: 'bg-green-100',
    text: 'text-green-600'
  },
  {
    icon: BriefcaseBusiness,
    value: '150k+',
    title: 'Job Posted',
    growth: '+26%',
    bg: 'bg-blue-100',
    text: 'text-blue-600'
  },
  {
    icon: CheckCheckIcon,
    value: '89k+',
    title: 'Successful Hires',
    growth: '+33%',
    bg: 'bg-orange-100',
    text: 'text-orange-600'
  },
];

  return (
   <section className='py-20 bg-white relative overflow-hidden'>
    <div className='container mx-auto px-4'>
      <motion.div
        initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.8}}
        viewport={{once:true}}
        className='text-center mb-16'
      >
        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
          Platform
          <span className=' bg-gradient-to-r from-teal-900 to-teal-600 bg-clip-text text-transparent'> Analytics</span>
        </h2>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
          Monitor overall platform performance with real-time data on user activity, job postings and successful Hires
        </p>
      </motion.div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-16'>
        {stats.map((stat,index)=>(
          <motion.div
          key={index}
          initial={{opacity:0,y:30}}
          animate={{opacity:1,y:0}}
          transition={{delay:index *0.1,duration:0.6}}
          viewport={{once:true}}
          className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300'
          >
            <div className='flex items-center justify-between mb-4'>
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.text}`} />
              </div>
              <span className='text-green-500 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full'>{stat.growth}</span>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-2'>{stat.value}</h3>
            <p className='text-gray-600'>{stat.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
   </section>
  )
}
