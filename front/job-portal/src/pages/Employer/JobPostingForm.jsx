import DashbordLayout from '../../components/Layout/DashbordLayout'
import { useState,useEffect } from 'react'
import { useLocation,useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { CATEGORIES,JOB_TYPES } from '../../Utils/data'
import toast from 'react-hot-toast'
import { AlertCircle, Briefcase, DollarSign, Eye, Loader, MapPin, Send, Users } from 'lucide-react'
import InputField from '../../Components/Input/InputField'
import SelectField from '../../Components/Input/SelectField'
import TextareaField from '../../Components/Input/TextareaField'
import JobPostingPreview from '../../Components/Cards/JobPostingPreview'

export default function JobPostingForm() {

  const navigate = useNavigate();
  const location = useLocation();
  const jobId=location.state?.jobId ||null;

  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    category: '',
    jobType: '',
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
  });

  const [errors,setErrors] = useState({});
  const [isSubmitting,setIsSubmitting] = useState(false);
  const [isPreview,setIsPreview] = useState(false);

  const handleInputChange=(field,value)=>{
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  }

  const handleSubmit=async (e)=>{
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const jobPayload={
      title: formData.jobTitle,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      category: formData.category,
      type: formData.jobType,
      salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
    };

    try {
      const respone = jobId
        ? await axiosInstance.put(`/api/jobs/${jobId}`, jobPayload)
        : await axiosInstance.post('/api/jobs', jobPayload);

      if (respone.status === 200 || respone.status === 201) {
        toast.success(
          jobId?"Job updated successfully":"Job posted successfully"
        );
        setFormData({
          jobTitle: '',
          location: '',
          category: '',
          jobType: '',
          description: '',
          requirements: '',
          salaryMin: '',
          salaryMax: '',
        });
        navigate('/employer-dashboard');
        return;
      }
      console.error('Unexpected response:', respone);
      toast.error("An error occurred while posting the job");

    }catch (error) {
      if(error.response?.data?.message){
        console.error("API Error:", error.response.data.message);
        toast.error(error.response.data.message);
      }else{
        console.error("Unexpected Error:", error);
        toast.error("An unexpected error occurred");
      }
    } finally{
      setIsSubmitting(false);
    }
  };

  const validateForm=(formData)=>{
    const errors = {};

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = 'Job title is required';
    }
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    if (!formData.jobType) {
      errors.jobType = 'Job type is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.requirements.trim()) {
      errors.requirements = 'Requirements are required';
    }
    if (!formData.salaryMin || !formData.salaryMax) {
      errors.salary = 'Salary range is required';
    }else if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      errors.salary = 'Minimum salary must be less than maximum salary';
    }
    return errors;
  };

  const isFormValid=()=>{
    const validationErrors = validateForm(formData);
    return Object.keys(validationErrors).length === 0;
  };


  useEffect(()=>{

    const fetchJobDetails=async()=>{
      if(jobId){
        try{
          const response = await axiosInstance.get(`/api/jobs/${jobId}`);
          
            const jobData = response.data;
            if(jobData){
            setFormData({
              jobTitle: jobData.title,
              location: jobData.location,
              category: jobData.category,
              jobType: jobData.type,
              description: jobData.description,
              requirements: jobData.requirements,
              salaryMin: jobData.salaryMin,
              salaryMax: jobData.salaryMax,
            });
          }
          
        }catch(error){
          console.error("Error fetching job details:");
          if(error.response){
            console.error("API Error:", error.response.data.message);
          }
        }
      }
    };
    fetchJobDetails();

    return()=>{}
  },[])

  if(isPreview){
    return (
      <DashbordLayout activeMenu='post-job'>
        <JobPostingPreview formData={formData} setIsPreview={setIsPreview}/>
      </DashbordLayout>
    )
  }


  return (
    <DashbordLayout activeMenu='post-job'>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white shadow-xl rounded-2xl p-6'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h2 className='text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
                  Post A New Job
                </h2>
                <p className='text-sm text-gray-600 mt-1'> 
                  Fill out the form below to create a new job posting
                </p>
              </div>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setIsPreview(true)}
                  disabled={!isFormValid()}
                  className='group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-teal-500 hover:to-teal-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl transform hover:-translate-y-0.5'
                >
                  <Eye className='h-4 w-4 transition-transform group-hover:-translate-x-1'/>
                  <span>Preview</span>
                </button>
              </div>
            </div>
            <div className='space-y-6'>
              {/* job title */}
              <InputField
                label='Job Title'
                id='jobTitle'
                placeholder='Enter job title'
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                error={errors.jobTitle}
                required
                icon={Briefcase}
              />
              {/* Location and Remote */}

              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-x-4 sm:space-y-0'>
                  <div className='flex-1'>
                    <InputField
                      label='Location'
                      id='location'
                      placeholder='Enter job location'
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      error={errors.location}
                      icon={MapPin}
                    />
                  </div>
                </div>
              </div>
              {/* Category and Job Type */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <SelectField
                  label='Category'
                  id='category'
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  options={CATEGORIES}
                  placeholder="Select a category"
                  error={errors.category}
                  required
                  icon={Users}
                />
                <SelectField
                  label='Job Type'
                  id='jobType'
                  value={formData.jobType}
                  onChange={(e) => handleInputChange('jobType', e.target.value)}
                  options={JOB_TYPES}
                  placeholder="Select job type"
                  error={errors.jobType}
                  required
                  icon={Briefcase}
                />
              </div>

              {/* Description */}
              <TextareaField
                label='Job Description'
                id='description'
                placeholder='Enter job description'
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={errors.description}
                helperText="Include key responsibilities, day-to-day tasks , and what make this role exiting"
                required
              />

              {/* Requirements */}
              <TextareaField
                label='Requirements'
                id='requirements'
                placeholder='Enter job requirements'
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                error={errors.requirements}
                helperText="Include must-have skills, qualifications, and experience"
                required
              />
              {/* Salary Range */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Salary Range <span className='text-red-500'>*</span>
                </label>
                <div className='grid grid-cols-3 gap-3'>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none z-10'>
                      <DollarSign className='h-5 w-5 text-gray-400'/>
                    </div>
                    <input
                      type='number'
                      placeholder='Min'
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                      className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 focus:border-teal-500 transition-colors duration-200'
                    />
                  </div>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none z-10'>
                      <DollarSign className='h-5 w-5 text-gray-400'/>
                    </div>
                    <input
                      type='number'
                      placeholder='Max'
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                      className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 focus:border-teal-500 transition-colors duration-200'
                    />
                  </div>
                </div>
                {errors.salary && (
                  <div className='flex items-center space-x-1 text-sm text-red-600'>
                    <AlertCircle className=''/>
                    <span>{errors.salary}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className='pt-2'>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid()}
                  className='w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-teal-500 hover:bg-teal-700 focus:outline-none focus:ring-offset-2  focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed outline-none transition-colors duration-200'
                >
                  {isSubmitting ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'>
                        <Loader className='h-5 w-5' />
                      </div>
                      Publishing Job...
                    </>
                  ):(
                    <>
                      <Send className='h-5 w-5 mr-2'/>
                      Publish Job
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashbordLayout>
  )
}