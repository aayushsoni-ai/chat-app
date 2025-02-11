import { apiClient } from "@/lib/api-client";
import NewDm from "./components/NewDm";
import ProfileInfo from "./components/ProfileInfo";
import { GET_DM_CONTACTS_ROUTE, GET_USER_CHANNELS_ROUTE } from "@/utils/constants.js";
import { useEffect } from "react";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";
import CreateChannel from "./components/create-channel/CreateChannel";

const ContactContainer = () => {
  const { setDirectMessagesContacts, directMessagesContacts, channels,setChannels, selectedChatType } =
    useAppStore();
  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    };
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
      });
      if (response.data.channels){
        
        setChannels(response.data.channels);
      }
    };

    getContacts();
    getChannels();
  }, [setChannels,setDirectMessagesContacts]);

  return (
    <div className={`relative md:w-[35vw] ${selectedChatType===undefined ? "block": " hidden md:block"} lg:w-[30vw] xl:w-[20vw] bg-[#0D0D0D] border-r-2 border-black/60 w-full`}>
    <div className="pt-3">
      <Logo />
    </div>

    <div className="my-5 font-serif">
      <div className="flex items-center justify-between pr-10">
        <Title text="Direct Messages " />
        <NewDm />
      </div>

      <div>
        <ContactList contacts={directMessagesContacts} />
      </div>
    </div>

    <div className="my-5 font-serif">
      <div className="flex items-center justify-between pr-10">
        <Title text="Channels" />
        <CreateChannel />
      </div>

      <div>
        <ContactList contacts={channels} isChannel={true} />
      </div>
    </div>

    <ProfileInfo />
  </div>
  );
};

export default ContactContainer;

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8B5E3C"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#D2B48C"
          
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#F5E1DA"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-medium font-serif text-[#e9e1de]">Syncronus</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-[#dbd0cc] pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
