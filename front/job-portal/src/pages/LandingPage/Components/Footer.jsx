import React from 'react'
import { Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='relative bg-gray-300 text-gray-900 overflow-hidden'>
        <div className='relative z-10 px-6 py-16'>
            <div className='max-w-6xl mx-auto'>
                <div className='text-center space-x-8'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-center space-x-2 mb-6 '>
                      <div className='w-10 h-10 bg-gradient-to-r from-teal-900 to-teal-500 rounded-lg flex items-center justify-center'>  
                        <Briefcase className='w-6 h-6 text-white'/>
                      </div>
                      <h3 className='text-2xl font-bold text-gray-800'>Employra</h3>
                    </div>
                    <p className={`text-sm text-gray-700 max-w-md mx-auto`}>
                      connecting talented profissionals with innovative companies 
                      worldwide ,Your career success is our mission
                    </p>
                  </div>
                  <br />
                  <div className='space-y-2'>  
                    <p className={`text-sm text-gray-700`}>
                      © {new Date().getFullYear()} All Rights Reserved
                    </p>
                    <p className={`text-xs text-gray-700`}>
                    Made By Wassim Gueddari
                    </p>
                  </div>
                </div>
            </div>
        </div>
    </footer>
  )
}
