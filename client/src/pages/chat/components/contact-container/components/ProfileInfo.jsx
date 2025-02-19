import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoExitOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { apiClient } from "@/lib/api-client";

const ProfileInfo = () => {
  const { userInfo,setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const logOut = async ()=>{
    try {
        const response = await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true})
       if(response.status===200) {
        navigate("/auth")
        setUserInfo(null)
       }
    } catch (error) {
        console.log(error)
        
    }
  }

  return (
    <div className="absolute bottom-0 h-20 flex items-center justify-between p-2 w-full bg-[#2a2b33]  gap-1">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-14 w-14  rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${userInfo.image}`}
                alt="profile"
                className="object-cover rounded-full w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-14 w-14 text-lg border-[0.5px] flex items-center justify-center rounded-full  
                                ${getColor(userInfo.color)}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
    {/* username div */}
        <div className="text-[#F5E1DA] font-sans">
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
{/* edit or logout icon div */}
      <div className="flex gap-5">
      <TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <FiEdit2
        className="text-[#D2B48C] text-xl font-medium font-serif transition-transform duration-300 hover:scale-110"
        onClick={() => navigate("/profile")}
      />
    </TooltipTrigger>
    <TooltipContent className="bg-[#F5E1DA] rounded-lg border-none text-black p-2 font-serif ">
      Edit Profile
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

        {/*  */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoExitOutline
                className="text-red-600 text-xl font-medium font-serif transition-transform duration-300 hover:scale-110"
                onClick={logOut}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#F5E1DA] rounded-lg border-none text-black p-2 font-serif">
              Log-Out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
