import ChatHeader from "./chat-components/ChatHeader"
import MessageBar from "./chat-components/MessageBar"
import MessageContainer from "./chat-components/MessageContainer"

const ChatContainer = () => {
  return (
    <div className="flex-1 h-[100vh] max-w-[100%] bg-[#0D0D0D] flex flex-col ">
      <ChatHeader />
      <MessageContainer />
      <MessageBar className="max-w-[100%]" />
    </div>
  );
};

export default ChatContainer
