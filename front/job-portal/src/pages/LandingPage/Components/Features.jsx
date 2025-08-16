import React from 'react';
import {jobSeekerFeatures,employerFeatures}from '../../../Utils/data';

export default function Features() {
  return (
    <div>
        <section className='py-20 bg-white relative overflow-hidden'>

            <div className='container mx-auto px-4 relative z-10'>
                <div className='text-center mb-16'>
                    <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
                        Everything You Need to
                        <span className='block bg-gradient-to-r from-teal-900 to-teal-600 bg-clip-text text-transparent'>
                        Succeed    
                        </span>  
                    </h2>
                    <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                        Whether You're Hiring or Getting Hired<br/>Find top talent or land your dream job One platform endless possibilities
                    </p>
                </div>

                <div className='grid md:grid-cols-2 gap-16 lg:gap-24'>
                    <div>
                        <div className='text-center mb-12'>
                            <h3 className='text-3xl font-bold text-gray-900 mb-4'>
                                For Jobseekers
                            </h3>
                            <div className='w-24 h-1 bg-gradient-to-r from-teal-900 to-teal-600 mx-auto rounded-full'/>
                        </div>
                        <div className='space-y-8'>
                            {jobSeekerFeatures.map((feature,index)=>(
                                <div key={index}
                                    className='group flex items-start space-x-4 p-6  rounded-2xl hover:bg-teal-100 transition-all duration-300 cursor-pointer'>
                                        <div className='border border-gray-500 flex-shrink-0 w-12 h-12 bg-teal-200 rounded-xl flex items-center justify-center'>
                                            <feature.icon className='w-6 h-6 text-teal-600'/>
                                        </div>
                                        <div>
                                            <h4 className='text-xl font-semibold text-gray-900 mb-2'>
                                                {feature.title}
                                            </h4>
                                            <p className='text-gray-600 leading-relaxed'>
                                                {feature.description}
                                            </p>
                                        </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className='text-center mb-12'>
                            <h3 className='text-3xl font-bold text-gray-900 mb-4'>
                                For Employers
                            </h3>
                            <div className='w-24 h-1 bg-gradient-to-r from-teal-900 to-teal-600 mx-auto rounded-full'/>
                        </div>
                        <div className='space-y-8'>
                            {employerFeatures.map((feature,index)=>(
                                <div key={index}
                                    className='group flex items-start space-x-4 p-6  rounded-2xl hover:bg-teal-100 transition-all duration-300 cursor-pointer'>
                                        <div className='border border-gray-500 flex-shrink-0 w-12 h-12 bg-teal-200 rounded-xl flex items-center justify-center'>
                                            <feature.icon className='w-6 h-6 text-teal-600'/>
                                        </div>
                                        <div>
                                            <h4 className='text-xl font-semibold text-gray-900 mb-2'>
                                                {feature.title}
                                            </h4>
                                            <p className='text-gray-600 leading-relaxed'>
                                                {feature.description}
                                            </p>
                                        </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
}
