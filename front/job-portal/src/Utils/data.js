import {
    Users,
    BarChart3,
    Shield,
    Briefcase,
    Building2,
    LayoutDashboard,
    Plus,
    Send,
    Upload,
    BadgePlus,
} from "lucide-react"

export const jobSeekerFeatures = [
    {
        icon: Send,
        title: "Apply Directly To Job Listings",
        description: "Apply to jobs in seconds with just one click. Connect directly with employers and get noticed faster"
    },
    {
        icon: Upload,
        title: "Upload Resumes/CVs",
        description: "Easily upload your resume to showcase your skills and experience. Stand out to employers and increase your chances of getting hired."
    },
    {
        icon: BadgePlus,
        title: "Create Detailed Profiles",
        description:"Showcase your skills, highlight your experience, and share your resume to attract the right employers and job opportunities",
    },
 
];

export const employerFeatures = [
    {
        icon: Users,
        title: "Manage Listings",
        description: "Easily create, edit, or remove job postings in one place. Stay organized and keep your opportunities up to date with a user-friendly dashboard.",
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        description: "Gain insights into job views, applications, and engagement. Track performance and make data-driven decisions.",
    },
    {
        icon: Shield,
        title: "Verified Candidates",
        description: "Hire with confidence. All applicants are verified to ensure you're connecting with genuine, qualified candidates.",
    },
]; 

// Navigation items configuration 
export const NAVIGATION_MENU = [ 
    { id: "employer-dashboard", name: "Dashboard", icon: LayoutDashboard }, 
    { id: "post-job", name: "Post Job", icon: Plus }, 
    { id: "manage-jobs", name: "Manage Jobs", icon: Briefcase }, 
    { id: "company-profile", name: "Company Profile", icon: Building2 }, 
]; 

// Categories and job types 
export const CATEGORIES = [ 
    { value: "Engineering", label: "Engineering" }, 
    { value: "Design", label: "Design" }, 
    { value: "Marketing", label: "Marketing" }, 
    { value: "Sales", label: "Sales" }, 
    { value: "IT & Software", label: "IT & Software" }, 
    { value: "Customer-service", label: "Customer Service" }, 
    { value: "Product", label: "Product" }, 
    { value: "Operations", label: "Operations" }, 
    { value: "Finance", label: "Finance" },
    { value: "HR", label: "Human Resources" },
    { value: "Other", label: "Other" },
];

export const JOB_TYPES = [
    { value: "Remote", label: "Remote" },
    { value: "Full-Time", label: "Full-Time" },
    { value: "Part-Time", label: "Part-Time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
];

export const SALARY_RANGES = [
    "Less than $1000",
    "$1000 - $15,000",
    "More than $15,000",
];