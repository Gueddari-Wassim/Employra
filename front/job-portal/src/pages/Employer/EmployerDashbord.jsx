import { use, useEffect, useState} from 'react'
import moment from 'moment'
import {useNavigate} from 'react-router-dom'
import axiosInstance from "../../Utils/axiosinstance" 
import DashbordLayout from '../../Components/Layout/DashbordLayout'
import LoadingSpinner from '../../Components/LoadingSpinner'
import { Briefcase, Building2, CheckCircle, Plus, TrendingUp, Users } from 'lucide-react'
import JobDashbordCard from '../../Components/Cards/JobDashbordCard'
import ApplicantDashbordCard from '../../Components/Cards/ApplicantDashbordCard'

const Card=({title, headerAction, subtitle, className, children})=>{
  return <div className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
    
    {(title|| headerAction)&&(
      <div className='flex items-center justify-between p-6 pb-4'>
        <div>
          {title&&(
            <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          )}
          {subtitle&&(
            <p className='text-sm text-gray-500 mt-1'>{subtitle}</p>
          )}
        </div>
        {headerAction}
      </div>
    )}
    <div className={title?"px-6 pb-6":"p-6"}>
      {children}
    </div>
  </div>
}

const StatCard=({title,value,icon: Icon,trend,trendValue,color="blue"})=>{
  const colorClasses={
    blue:"from-blue-500 to-blue-600",
    green:"from-emerald-500 to-emerald-600",
    purple:"from-purple-500 to-purple-600",
    orange:"from-orange-500 to-orange-600",
  };
  return (
  <Card className={`bg-gradient-to-br ${colorClasses[color]} text-white border-0`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {trend && (
          <div className="flex items-center mt-2 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="bg-white/10 p-3 rounded-full">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </Card>
);
};

export default function EmployerDashbord() {

  const navigate = useNavigate()
  const [dashbordData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const getDashbordOverView=async()=>{
   try{
     setIsLoading(true);
     const response = await axiosInstance.get("/api/analytics/overview");
     if (response.status === 200) {
       setDashboardData(response.data);
     }
   } catch (error) {
     console.log("Error fetching dashboard data:", error);
   } finally {
     setIsLoading(false);
   }
  }

  useEffect(() => {
    getDashbordOverView();
    return () => {};
  },[])

  return (
    <DashbordLayout activeMenu='employer-dashboard'>
      {isLoading?(
        <LoadingSpinner/>
      ):(
      <div className='max-w-7xl mx-auto space-y-8 mb-96'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <StatCard
              title='Active Jobs'
              value={dashbordData?.counts?.totalActiveJobs || 0}
              icon={Briefcase}
              trend={true}
              trendValue={`${dashbordData?.counts?.trends?.activeJobs ||0}%`}
              color='blue'
            />
            <StatCard
              title='Total Applicants'
              value={dashbordData?.counts?.totalApplications || 0}
              icon={Users}
              trend={true}
              trendValue={`${dashbordData?.counts?.trends?.totalApplicants ||0}%`}
              color='green'
            />

            <StatCard
              title='Hired'
              value={dashbordData?.counts?.totalHired || 0}
              icon={CheckCircle}
              trend={true}
              trendValue={`${dashbordData?.counts?.trends?.totalHired ||0}%`}
              color='purple'
            />
          </div>

          {/* Recent Activity */}
          <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card
            title="Recent Job Posts"
            subtitle="Your latest job postings"
            headerAction={ 
              <button
                className="text-sm text-teal-700 hover:text-teal-800 font-medium"
                onClick={() => navigate("/manage-jobs")}
              >
                View all
              </button>
            }
          >
            <div className='space-y-3'>
              {dashbordData?.data?.recentJobs
                ?.slice(0,3)
                ?.map((job,index)=>(
                  <JobDashbordCard key={index} job={job} />
                ))}
            </div>
          </Card>

          <Card
            title="Recent Applications"
            subtitle="Latest candidate applications"
            headerAction={
              <button
                className="text-sm text-teal-700 hover:text-teal-800 font-medium"
                onClick={() => navigate("/manage-applications")}
              >
                View all
              </button>
            }
            >
              <div className='space-y-3'>
              {dashbordData?.data?.recentApplications
                ?.slice(0,3)
                ?.map((data,index)=>(
                  <ApplicantDashbordCard 
                    key={index}
                    applicant={data?.applicant || ""}
                    position={data?.job?.title || ""}
                    time={moment(data?.createdAt).fromNow()}
                  />
                ))}
              </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card
          title="Quick Actions"
          subtitle="Common tasks to get you started"
        >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
        title: "Post New Job",
        icon: Plus,
        color: "bg-blue-50 text-blue-700",
        path: "/post-job",
          },
          {
        title: "Review Applications",
        icon: Users,
        color: "bg-green-50 text-green-700",
        path: "/manage-jobs",
          },
          {
        title: "Company Settings",
        icon: Building2,
        color: "bg-orange-50 text-orange-700",
        path: "/company-profile",
          }
        ].map((action, index) => (
        <button
        key={index}
        className="flex items-center space-x-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left pl-4 pr-6 py-3"
        onClick={() => navigate(action.path)}
        >
        <div className={`p-2 rounded-lg ${action.color}`}>
          <action.icon className="h-5 w-5" />
        </div>
        <span className="font-medium text-gray-900">
          {action.title}
        </span>
      </button>
        ))}
      </div>
      </Card>
      </div>
      )}
    </DashbordLayout>
  );
};
