import React from 'react'
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {

    const isAuthenticated=false;
    const user={fullname:"wassim",role:"employer"}
    const navigate=useNavigate();

  return (
    <motion.header
        initial={{opacity:0,y:-20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.6}}
        className="fixed top-0 left-0 right-0 z-50  backdrop-blur-sm border-b border-gray-100"
    
    >
        <div className='w-full mx-auto px-4 hover:bg-gray-300 transition-all duration-300'>
            <div className='flex items-center justify-between h-16'>
                <div className='flex items-center space-x-3'>
                    <div className='w-9 h-9 bg-gradient-to-r from-teal-900 to-teal-500 rounded-lg flex items-center justify-center'>
                        <BriefcaseBusiness className='w-6 h-6 text-white'/>
                    </div>
                    <span className='text-xl font-bold text-gray-900'>Employra</span>
                </div>

                <nav className='hidden md:flex items-center space-x-8'>
                    <a onClick={()=>navigate('/find-jobs')}
                        className='text-gray-600 hover:text-gray-900 transition-colors font-medium'>
                        Find A Job
                    </a>
                    <a onClick={()=>navigate(
                        isAuthenticated &&user.role==="employer"
                        ?"/employer-dashbord"
                        :"/login"
                    )} className='text-gray-600 hover:text-gray-900 transition-colors font-medium'>
                        For Employers
                    </a>
                </nav>

                <div className=''>
                    {isAuthenticated ?(
                        <div className='flex items-center justify-center space-x-3'>
                            <span className='text-gray-700'>Welcome,{user?.fullname}</span>
                            <a href={
                                user.role==="employer"
                                ?"/employer-dashbord"
                                :"/find-jobs"
                            } className='bg-gradient-to-r from-teal-800 to-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:from-teal-900 hover:to-teal-600 transition-all duration-300 shadow-sm hover:shadow-md'>
                                Dashbord
                            </a>
                        </div>
                    ):(
                        <>
                        <div className='flex items-center justify-center space-x-1'>
                            <a href="/login" className='text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-teal-600'>
                                Login
                            </a>
                            <a href="/signup" className='bg-gradient-to-r from-teal-800 to-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:from-teal-900 hover:to-teal-600 transition-all duration-300 shadow-sm hover:shadow-md'>
                                Signup
                            </a>
                        </div>
                        </>
                        
                    )
                    }
                </div>
            </div>
        </div>
    </motion.header>
  )
}
