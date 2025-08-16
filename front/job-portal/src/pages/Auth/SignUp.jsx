import React, { useState } from 'react'
import{ motion, useSpring }from 'framer-motion'
import { AlertCircle, ArrowLeft, Building2, CheckCircle, Eye, EyeOff, Loader, Lock, Mail, Phone, Upload, User, User2, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../Utils/helper';
import { validatePassword } from '../../Utils/helper';
import { validatePoneNumber } from '../../Utils/helper';
import { validateUserName } from '../../Utils/helper';
import { validateAvatar } from '../../Utils/helper';
import axios from 'axios';


export default function SignUp() {

  const[formData,setFormData]=useState({
    fullName:'',
    email:'',
    userName:'',
    phoneNumber:'',
    password:'',
    avatar:null,
    role:''
  })

  const[formState,setFormState]=useState({
    loading:false,
    errors:{},
    showPassword:false,
    avatarPreview:null,
    success:false
  });


  //Handle Input changes
  const handleInputchange=(e)=>{
    const {name,value}=e.target;
    setFormData(prev=>({
      ...prev,
      [name]:value
    }));
    if(formState.errors[name]){
      setFormState(prev=>({
        ...prev,
        errors:{...prev.errors,[name]:''}
      }));
    }
  };

  const handleRoleChange=(role)=>{  
    setFormData((prev)=>({...prev,role}));
    if(formState.errors.role){
      setFormState((prev)=>({
        ...prev,
        errors:{...prev.errors,role:""},
      }));
    }
  };

  const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const error = validateAvatar(file);
  if (error) {
    setFormState(prev => ({
      ...prev,
      errors: { ...prev.errors, avatar: error },
    }));
    return;
  }

  const formDataObj = new FormData();
  formDataObj.append("image", file);

  try {
    const res = await axios.post("/api/auth/upload-image", formDataObj, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setFormData(prev => ({
      ...prev,
      avatar: res.data.imgurl
    }));

    setFormState(prev => ({
      ...prev,
      avatarPreview: res.data.imgurl,
      errors: { ...prev.errors, avatar: "" }
    }));
  } catch (err) {
    console.error("Image upload error:", err);
  }
};



  const validateForm=()=>{
    const errors={
          fullName:!formData.fullName?'Enter Full Name':'',
          email:validateEmail(formData.email),
          userName:validateUserName(formData.userName),
          phoneNumber:validatePoneNumber(formData.phoneNumber),
          password:validatePassword(formData.password),
          role:!formData.role?"Please Select a Role":"",
          avatar:"",
        }
        Object.keys(errors).forEach(key=>{
          if(!errors[key]) delete errors[key];
        });

        setFormState(prev=>({...prev,errors}));
        return Object.keys(errors).length === 0;
  };




  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!validateForm())return;
    setFormState((prev)=>({...prev,loading:true}));

    try {
    // Send data to backend API
    const response = await axios.post("/api/auth/signup", {
      fullName: formData.fullName,
      email: formData.email,
      userName: formData.userName,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      role: formData.role,
      avatar: formData.avatar || null

    });

    // If successful
    console.log("Signup Success:", response.data);

    setFormState((prev) => ({
      ...prev,
      loading: false,
      success: true, // show success message
      errors: {}
    }));

  } catch (error) {
    console.error("Signup Error:", error);

    // Extract error message from backend
    const errorMessage =
      error.response?.data?.message || "Registration failed. Please try again.";

    setFormState((prev) => ({
      ...prev,
      loading: false,
      errors: { submit: errorMessage }
    }));
  }
  };


  if (formState.success) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
            >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created !</h2>
                <p className="text-gray-600 mb-4">
                    Welcome To Employra ! Your Accouont Has Seccessfully Created.
                </p>

                <Link to={'/login'} className='bg-gradient-to-r from-teal-800 to-teal-500 text-white p-2 rounded-xl font-semibold text-lg hover:from-teal-900 hover:to-teal-900 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center'>
                  Sign In Here
                </Link>
            </motion.div>
        </div>
    );
}


  return <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8'>
    <motion.div
      initial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.6}}
      className='bg-gradient-to-r from-teal-400 to-teal-700 p-8 rounded-xl shadow-lg max-w-md w-full'
    >
      <div className='border-2 max-w-7.5 rounded-2xl'>
            <Link to={'/'} className=''>
            <ArrowLeft className='w-7 h-7'/>
            </Link>
      </div>
      <div className='text-center mb-8'>
        <h2 className='text-xl font-bold text-gray-900 mb-2'>
          Create Account
        </h2>
        <p className='text-sm text-white'>
          Join thousands of proffessionals finding their dream jobs 
        </p>
      </div>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/*full name*/}
        <div>
          <label className='block text-sm font-medium text-white mb-2'>
            Full Name *
          </label>
          <div className='relative'>
            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5'/>
            <input 
              type="text"
              name='fullName'
              value={formData.fullName}
              onChange={handleInputchange} 
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.fullName
                ?"border-2 border-red-500"
                :"border-2 border-white" }
                focus:ring-2 focus:ring-white focus:border-transparent transition-colors`
                }
                placeholder='Enter Your Full Name'
                />
          </div>
          {formState.errors.fullName&&(
            <p className='text-red-500 text-sm mt-1 flex items-center'>
              <AlertCircle className='w-4 h-4 mr-1'/>
              {formState.errors.fullName}
            </p>
          )}
        </div>
        {/*email*/}
        <div>
          <label className='block text-sm font-medium text-white mb-2'>
            Address Email *
          </label>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5'/>
            <input 
              type="text"
              name='email'
              value={formData.email}
              onChange={handleInputchange} 
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.email
                ?"border-2 border-red-500"
                :"border-2 border-white" }
                focus:ring-2 focus:ring-white focus:border-transparent transition-colors`
                }
                placeholder='Enter Your Email'
                />
          </div>
          {formState.errors.email&&(
            <p className='text-red-500 text-sm mt-1 flex items-center'>
              <AlertCircle className='w-4 h-4 mr-1'/>
              {formState.errors.email}
            </p>
          )}
        </div>
        {/*User Name*/}
        <div>
          <label className='block text-sm font-medium text-white mb-2'>
            User Name *
          </label>
          <div className='relative'>
            <User2 className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5'/>
            <input 
              type="text"
              name='userName'
              value={formData.userName}
              onChange={handleInputchange} 
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.userName
                ?"border-2 border-red-500"
                :"border-2 border-white" }
                focus:ring-2 focus:ring-white focus:border-transparent transition-colors`
                }
                placeholder='Choose A UserName'
                />
          </div>
          {formState.errors.userName&&(
            <p className='text-red-500 text-sm mt-1 flex items-center'>
              <AlertCircle className='w-4 h-4 mr-1'/>
              {formState.errors.userName}
            </p>
          )}
        </div>
        {/*Phone Number*/}
        <div>
          <label className='block text-sm font-medium text-white mb-2'>
            Phone Number *
          </label>
          <div className='relative'>
            <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5'/>
            <input 
              type="tel"
              pattern="^\+?[0-9\s\-]{7,15}$"
              name='phoneNumber'
              value={formData.phoneNumber}
              onChange={handleInputchange} 
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.phoneNumber
                ?"border-2 border-red-500"
                :"border-2 border-white" }
                focus:ring-2 focus:ring-white focus:border-transparent transition-colors`
                }
                placeholder='Put Your Phone Number'
                />
          </div>
          {formState.errors.phoneNumber&&(
            <p className='text-red-500 text-sm mt-1 flex items-center'>
              <AlertCircle className='w-4 h-4 mr-1'/>
              {formState.errors.phoneNumber}
            </p>
          )}
        </div>
        {/*Password*/}
        <div>
          <label className='block text-sm font-medium text-white mb-2'>
            Password *
          </label>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5'/>
            <input 
              type={formState.showPassword?'text':'password'}
              name='password'
              value={formData.password}
              onChange={handleInputchange} 
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.password
                ?"border-2 border-red-500"
                :"border-2 border-white" }
                focus:ring-2 focus:ring-white focus:border-transparent transition-colors`
                }
                placeholder='Create A Strong Password'
                />
                <button
                  type='button'
                  onClick={()=>setFormState((prev)=>({...prev,showPassword:!prev.showPassword}))}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-700'
                  >
                    {formState.showPassword?(<EyeOff className='w-5 h-5'/>):(<Eye className='w-5 h-5'/>)}
                  </button>
            </div>
            {formState.errors.password&&(
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <AlertCircle className='w-4 h-4 mr-1'/>
                {formState.errors.password}
              </p>
            )}
        </div>
        {/*Profile Picture*/}
        <div>
          <label className='block text-sm font-medium text-white mb-2 '>
            Profile Picture (optional)
          </label>
          <div className='flex items-center space-x-4'>
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
              {formState.avatarPreview?(
                <img 
                  src={formState.avatarPreview} 
                  alt="Avatar Preview"
                  className='w-full h-full object-cover' 
                  />
              ):(
                <User className='w-8 h-8 text-gray-400'/>
              )}
            </div>
            <div className='flex-1'>
              <input 
                type="file" 
                id="avatar"
                accept='.jpg,.jpeg,.png'
                onChange={handleAvatarChange} 
                className='hidden'
                />
                <label 
                  htmlFor="avatar"
                  className='cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2'
                >
                  <Upload className='w-4 h-4'/>
                  <span>Upload Photo</span>
                </label>
                <p className='text-xs text-white mt-1'>JPG,PNG up to 5MB</p>
            </div>
          </div>
          {formState.errors.avatar&&(
            <p className='text-red-500 text-sm mt-1 flex items-center'>
              <AlertCircle className='w-4 h-4 mr-1'/>
              {formState.errors.avatar}
            </p>
          )}
        </div>
        {/*Role Section*/}
        <div>
          <label className='block text-sm text-white mb-3'>
            I am a *
          </label>
          <div className='grid grid-cols-2 gap-4'>
            <button
              type='button'
              onClick={()=>handleRoleChange("jobseeker")}
              className={`p-4 rounded-lg border-2 transition-all ${
              formData.role==="jobseeker"
                ?"border-black bg-blue-50 text-gray-900"
                : "border-gray-200 hover:border-gray-300 "
              }`}
            >
              <UserCheck className='w-8 h-8 mx-auto mb-2 '/>
              <div className='font-medium'>Jobseeker</div>
              <div className='text-xs text-black '>
                Looking For Opportunities
              </div>
            </button>
            <button
              type='button'
              onClick={()=>handleRoleChange("employer")}
              className={`p-4 rounded-lg border-2 transition-all ${
              formData.role==="employer"
                ?"border-black bg-blue-50 text-gray-900"
                : "border-gray-200 hover:border-gray-300 "
              }`}
            >
              <Building2 className='w-8 h-8 mx-auto mb-2 '/>
              <div className='font-medium'>Employer</div>
              <div className='text-xs text-black'>
                Hiring Talent
              </div>
            </button>
          </div>
          {formState.errors.role&&(
            <p className='text-red-500 text-sm mt-1 flex items-center'>
              <AlertCircle className='w-4 h-4 mr-1'/>
              {formState.errors.role}
            </p>
          )}
        </div>
        {/*submit error*/}
        {formState.errors.submit&&(
          <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
            <p className='text-red-700 text-sm mt-1 flex items-center'>
              <AlertCircle className='w-4 h-4 mr-2'/>
                {formState.errors.submit}
            </p>
          </div>
        )}
        {/*submit button*/}
        <button
          type='submit'
          disabled={formState.loading}
          className='w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 '
          >
          {formState.loading?(
            <>
              <Loader className='w-5 h-5 animate-spin'/>
              <span>Creating Account ...</span>
            </>
            ):(
              <span>Create Account</span>
          )}
        </button>
          {/*login link*/}
        <div className='text-center'> 
          <p className='text-white'>
              Already Have An Account ?{' '}
            <Link to={'/login'} className='text-gray-900 hover:text-black font-medium underline'>
                Sign In Here
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  </div>
}
