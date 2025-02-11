import React , {children, useEffect , useState}from 'react'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from './pages/auth/Auth';
import Chat from './pages/chat/Chat';
import Profile from './pages/profile/Profile';
import { useAppStore } from "./store/index";
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';
 
const PrivateRoute = ({children}) => {
  const {userInfo } = useAppStore();
  const isAuthenticated = !!userInfo
  return isAuthenticated ? children : <Navigate to={"/auth"} />
}

const AuthRoute = ({children}) => {
  const {userInfo } = useAppStore();
  const isAuthenticated = !!userInfo
  return isAuthenticated ? <Navigate to={"/chat"}  /> : children
}

function App() {
  const {userInfo , setUserInfo} = useAppStore()
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    const getUserData = async ()=>{
      try {
        const response = await apiClient.get(GET_USER_INFO, {withCredentials:true})
        if(response.status===200 && response
          .data.id){
            setUserInfo(response.data)
          }
          else {
            setUserInfo(undefined)
          
          }
        console.log({response})
      } catch (error) {
        setUserInfo(undefined)
      }
      finally{
        setLoading(false)
      }
    }
    if(!userInfo){
      getUserData()
    }else {
      setLoading(false)
    }

  },[userInfo , setUserInfo])
  if(loading){
    return    <div className="flex justify-center items-center h-screen bg-[#1b1c24]">
    <div className="relative flex items-center justify-center">
      {/* Outer Pulsating Ring */}
      <div className="absolute w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
      <div className="absolute w-16 h-16 border-4 border-transparent border-b-pink-500 rounded-full animate-spin"></div>
      
      {/* Inner Glowing Dot */}
      <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500"></div>
    </div>
  </div>
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthRoute><Auth /></AuthRoute>}/>
        <Route path='/chat' element={<PrivateRoute><Chat /></PrivateRoute>}/>
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>}/>
        <Route path='*' element={<Navigate to ="/auth" />}/>
      </Routes>
    </BrowserRouter>
  ) 
}

export default App
