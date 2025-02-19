import React, { useEffect } from "react";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import ChatContainer from "./components/chat-container/ChatContainer";
import EmptyChatContainer from "./components/empty-chat-container/EmptyChatContainer";
import ContactContainer from "./components/contact-container/ContactContainer";

function Chat() {
  const {
    userInfo,
    selectedChatType,
    selectedChatData,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex text-black overflow-hidden h-[100vh]">
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Uploading File</h5>
          {fileUploadProgress}%
        </div>
      )}

      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {fileDownloadProgress}%
        </div>
      )}

      <ContactContainer  />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer className='max-w-[100%]' />
      )}
    </div>
  );
}

export default Chat;
