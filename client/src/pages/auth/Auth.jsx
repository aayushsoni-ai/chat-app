import { useState } from "react"
import Victory from "@/assets/victory.svg"
import Background from "@/assets/login2.png"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client"
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router";
import { useAppStore } from "@/store";

function Auth() {
  const navigate = useNavigate();
  const {setUserInfo} = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const validateLogin =()=>{
    if(!email.length){
      toast.error("Email is required!!")
      return false;
    }
    if(!password.length){
      toast.error("Password is required!!")
      return false;
    }
    return true;
  }
  const validateSignup =()=>{
    if(!email.length){
      toast.error("Email is required!!")
      return false;
    }
    if(!password.length){
      toast.error("Password is required!!")
      return false;
    }
    if(password !== confirmPassword){
      toast.error("Password should be same!!")
      return false;
    }
    return true;
  }

  const handleLogin = async()=>{
    if(validateLogin){

      const response = await apiClient.post(LOGIN_ROUTE,{email,password},{withCredentials:true})
      if(response.data.user.id){
        setUserInfo(response.data.user)
        if(response.data.user.profileSetup){ navitage("/chat") }
      else { navigate("/profile") }
      }
      console.log({response})
    }
    
  }

  const handleSignUp = async()=>{
    if(validateSignup()){
      const response = await apiClient.post(SIGNUP_ROUTE,{email,password},{withCredentials:true})
      if(response.status===201){
        setUserInfo(response.data.user)
        navigate("/profile")
      }
      console.log({response})
    }
  }


  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center'>
      <div className='h-[80vh] w-[80vw] bg-white border-2 border-white text-opacity-90 shadow-2xl rounded-3xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] grid xl:grid-cols-2'>
        <div className='flex flex-col gap-3  items-center justify-center'>
          <div className='flex flex-col items-center justify-center'>
          <div className='flex items-center justify-center '>
            <h1 className='text-5xl font-bold md:text-6xl pl-7'>
              Welcome
            </h1>
            <img src={Victory} alt="Victory sign" className="h-[100px]" />
          </div>

          <p className="font-serif font-medium text-center text-sm sm:text-base md:text-lg">
  Fill in the details to get started with the best chat app
</p>

          </div>
          <div className="flex items-center justify-center w-full">
                <Tabs className="w-3/4" defaultValue="login">
                  <TabsList className="bg-transparent rounded-none w-full flex flex-col-2">
                    <TabsTrigger value="login"
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300" >Login</TabsTrigger>

                    <TabsTrigger value="signup"
                      className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">SignUp</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="flex flex-col mt-10 gap-5">
                    <Input 
                    placeholder= "Email"
                    type= "email"
                    value={email}
                    onChange= {(e)=> setEmail(e.target.value)}
                    className="rounded-full p-6"
                     />
                    <Input 
                    placeholder= "Password"
                    type= "password"
                    value={password}
                    onChange= {(e)=> setPassword(e.target.value)}
                    className="rounded-full p-6"
                     />
                     <Button className="rounded-full p-6" onClick={handleLogin} >Login</Button>
                  </TabsContent>
                  <TabsContent value="signup" className="flex flex-col  gap-5">
                    <Input 
                    placeholder= "Email"
                    type= "email"
                    value={email}
                    onChange= {(e)=> setEmail(e.target.value)}
                    className="rounded-full p-6"
                     />
                    <Input 
                    placeholder= "Password"
                    type= "password"
                    value={password}
                    onChange= {(e)=> setPassword(e.target.value)}
                    className="rounded-full p-6"
                     />
                    <Input 
                    placeholder= "Confirm Password"
                    type= "password"
                    value={confirmPassword}
                    onChange= {(e)=> setConfirmPassword(e.target.value)}
                    className="rounded-full p-6"
                     />
                     <Button className="rounded-full p-6" onClick={handleSignUp} >Signup</Button>
                  </TabsContent>
                </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex items-center justify-center ">
          <img src={Background} alt="bg-png-login" className="h-[600px]" />
        </div>
      </div>
    </div>
  )
}

export default Auth
