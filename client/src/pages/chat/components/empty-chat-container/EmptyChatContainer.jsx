import { animationDefaultOptions } from "@/lib/utils"
import Lottie from "react-lottie"
const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#0D0D0D] md:flex flex-col justify-center items-center hidden  duration-1000 transition-all">
      <Lottie 
      isClickToPauseDisabled={true}
      height={200}
      width={200}
      options={animationDefaultOptions}
      />
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
  <h3 className="font-serif font-medium">
    Hi<span className="text-[#eba46d]">!</span>  
    Welcome to  
    <span className="text-[#eba46d]"> Synchronous </span>  
    Chat App  
    <span className="text-[#eba46d]">.</span>
  </h3>
</div>

    </div>
  )
}

export default EmptyChatContainer
