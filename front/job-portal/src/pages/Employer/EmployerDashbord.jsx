import { use, useEffect, useState} from 'react'
import moment from 'moment'
import {useNavigate} from 'react-router-dom'
import axiosInstance from "../../Utils/axiosinstance" 
import DashbordLayout from '../../Components/Layout/DashbordLayout'

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
      
    </DashbordLayout>
  )
}
