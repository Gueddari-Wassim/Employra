import React from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowBigRight, Search } from 'lucide-react';
import { useAuth } from '../../../Context/AuthContext';

export default function Hero() {

    const {user,isAuthenticated}=useAuth();
    
    const navigate=useNavigate();

  return (
    <section className='pt-15 pb-16 bg-white min-h-screen flex items-center'>
        <div className='container mx-auto '>
            <div className='max-w-4xl mx-auto text-center'>
                <motion.h1
                initial={{opacity:0,y:30}}
                animate={{opacity:1,y:30}}
                transition={{duration:0.0}}
                className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight pt-10'
                >
                   Land Your Dream Role Or
                    <span className='block bg-gradient-to-r from-teal-900 to-teal-500 bg-clip-text text-transparent mt-2'> Hire the Best</span>
                </motion.h1>

                <motion.p
                initial={{opacity:0,y:30}}
                animate={{opacity:1,y:30}}
                transition={{delay:0.2,duration:0.8}}
                className='text-md md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed'
                >
                    Your Dream Job Is Just a Click Away. Discover opportunities, connect with top employers, and build your future today.
                </motion.p>

                <motion.div
                initial={{opacity:0,y:30}}
                animate={{opacity:1,y:30}}
                transition={{delay:0.2,duration:0.8}}
                className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'
                >
                    <motion.button
                    whileHover={{scale:1.02}}
                    whileTap={{scale:0.98}}
                    className='group bg-gradient-to-r from-teal-800 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-900 hover:to-teal-900 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2'
                    onClick={()=>navigate(isAuthenticated&&user?.role==='jobseeker'
                        ?'/find-jobs'
                        :'/login')}
                    >
                        <Search className='w-5 h-5'/>
                        <span>Find A Job</span>
                        <ArrowBigRight className='w-5 h-5 group-hover:translate-x-1 transition-transform'/>
                    </motion.button>

                    <motion.button
                    whileHover={{scale:1.02}}
                    whileTap={{scale:0.98}}
                    className='bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md'
                    onClick={()=>navigate(
                        isAuthenticated&&user?.role==='employer'
                        ?'/post-job'
                        :'/login'
                    )}
                    >
                        <span>Post A Job</span>
                    </motion.button>
                </motion.div>

                <div>
                    <div className=''/>
                    <div className=''/>
                    <div className=''/>
                    <div className=''/>
                </div>
            </div>
        </div>
    </section>
  )
}
