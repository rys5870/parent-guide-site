import DashboardStats from "@/components/adminComponents/DashboardStats";
import UserCount from "@/components/adminComponents/UserCount";
import UserSignupLineChart from "@/components/adminComponents/UserSignupLineChart";



export default function Home() {
  return (
     <div className="space-y-8">
      <UserCount/>
      <UserSignupLineChart/>
      <DashboardStats/>
      
    </div>
  );
}


