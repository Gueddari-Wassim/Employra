import React, { useState, useEffect } from 'react'
import{ motion }from 'framer-motion';
import {AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff,Loader, Lock, Mail} from 'lucide-react';
import { Link, useNavigate }from 'react-router-dom'
import { validateEmail } from '../../Utils/helper';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();

  const[formData,setFormData]=useState({
    email:'',
    password:'',
    rememberMe:false
  });

  const[formstate,setFormState]=useState({
    loading:false,
    errors:{},
    showPassword:false,
    success:false,
    userData:null
  });

  const validatePassword =(password)=>{
    if(!password)return'Password Is Required';
    return'';
  };

  const validateForm=()=>{
    const errors={
      email:validateEmail(formData.email),
      password:validatePassword(formData.password)
    }

    Object.keys(errors).forEach(key=>{
      if(!errors[key]) delete errors[key];
    });

    setFormState(prev=>({...prev,errors}));
      return Object.keys(errors).length === 0;
  };

  //Handle Input changes
  const handleInputchange=(e)=>{
    const {name,value}=e.target;
    setFormData(prev=>({
      ...prev,
      [name]:value
    }));
    if(formstate.errors[name]){
      setFormState(prev=>({
        ...prev,
        errors:{...prev.errors,[name]:''}
      }));
    }
  };

  const handleSubmit =async (e)=>{
    e.preventDefault();
    if(!validateForm())return;
    setFormState(prev=>({...prev,loading:true}));
    
    try {
      const response = await axios.post("/api/auth/login",
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const data = response.data;
      console.log('Login response:', data);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setFormState(prev => ({
        ...prev,
        loading: false,
        success: true,
        userData: data.user
      }));

    } catch(error) {
      console.error('Login error:', error);
      setFormState(prev=>({
        ...prev,
        loading:false,
        errors:{
          submit:error.response?.data?.message||'Login Failed. Please Check Your Credentials.'
        }
      }))
    }
  };

  
  useEffect(() => {
    console.log('useEffect triggered:', { success: formstate.success, userData: formstate.userData });
    
    if (formstate.success && formstate.userData) {
      const timer = setTimeout(() => {
        console.log('Redirecting user with role:', formstate.userData.role);
        
        if (formstate.userData.role === 'employer') {
          navigate('/employer-dashbord');
        } else if (formstate.userData.role === 'jobseeker') {
          navigate('/find-jobs');
        } else {
          navigate('/');
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [formstate.success, formstate.userData, navigate]);



  if (formstate.success) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
            >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back {formstate.userData.userName}!</h2>
                <p className="text-gray-600 mb-4">
                    You have been successfully logged in.
                </p>
                
                {formstate.userData && (
                  <p className="text-sm text-blue-600 mb-4">
                    Redirecting to your dashboard...
                  </p>
                )}

                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            </motion.div>
        </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.6}}
        className='bg-gradient-to-r from-teal-400 to-teal-700 p-8 rounded-xl shadow-lg max-w-md w-full'>
          <div className='border-2 max-w-7.5 rounded-2xl'>
            <Link to={'/'} className=''>
            <ArrowLeft className='w-7 h-7'/>
            </Link>
          </div>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Welcome Back
            </h2>
            <p className='text-white'>
            Sign In To Your Employra  Account 
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-white mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <Mail  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5'/>
                <input 
                  type="email"
                  name='email'
                  value={formData.email}
                  onChange={handleInputchange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border
                  ${formstate.errors.email?' border-2 border-red-500':'border-2 border-white'} 
                  focus:ring-2 focus:ring-white focus:border-transparent transition-colors`} 
                  placeholder='Enter Your Email'
                  />
              </div>
              {formstate.errors.email&&(
                <p className='text-red-500 text-sm mt-1 flex items-center'>
                  <AlertCircle className='w-4 h-4 mr-1'/>
                  {formstate.errors.email}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-white mb-2'>
                Password
              </label>
              <div className='relative'>
                <Lock  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5'/>
                <input 
                  type={formstate.showPassword?'text':'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleInputchange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border
                  ${formstate.errors.password?' border-2 border-red-500':'border-2 border-white'} 
                  focus:ring-2 focus:ring-white focus:border-transparent transition-colors`} 
                  placeholder='Enter Your Password'
                  />
                  <button
                  type='button'
                  onClick={()=>setFormState(prev=>({...prev,showPassword:!prev.showPassword}))}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-800'
                  >
                    {formstate.showPassword?<EyeOff className='w-5 h-5'/>:<Eye className='w-5 h-5'/>}
                  </button>
              </div>
              {formstate.errors.password&&(
                <p className='text-red-500 text-sm mt-1 flex items-center'>
                  <AlertCircle className='w-4 h-4 mr-1'/>
                  {formstate.errors.password}
                </p>
              )}
             </div>
              {/*submit errror*/}
             {formstate.errors.submit&&(
              <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                <p className='text-red-700 text-sm mt-1 flex items-center'>
                  <AlertCircle className='w-4 h-4 mr-2'/>
                  {formstate.errors.submit}
                </p>
              </div>
             )}

              {/*submit button*/}

              <button
              type='submit'
              disabled={formstate.loading}
              className='w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 '
              >
                {formstate.loading?(
                  <>
                  <Loader className='w-5 h-5 animate-spin'/>
                  <span>Signing In ...</span>
                  </>
                ):(
                  <span>Sign In</span>
                )}
              </button>

              <div className='text-center'>
                <p className='text-white'>
                  Don't have an account?{' '}
                  <Link to={'/signup'} className='text-gray-900 hover:text-black font-medium underline'>
                    Create One Here
                  </Link>
                </p>
              </div>
            </form>
      </motion.div>
    </div>
  )
}